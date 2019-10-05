import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { sendRefreshToken } from './sendRefreshToken';
import { isAuth } from './isAuth';
import { getConnection } from 'typeorm';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'Hi!!!';
	}

	@Query(() => String)
	@UseMiddleware(isAuth)
	bye(@Ctx() { payload }: MyContext) {
		return `bye!!! Your userId is ${payload!.userId}`;
	}

	@Query(() => [User])
	users() {
		return User.find();
	}

	// This is usually not being done via mutations. It would be better to create a function that user can call in case they forgets pass or if someones acc got hacked
	@Mutation(() => Boolean)
	async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, 'tokenVersion', 1);

		return true;
	}

	@Mutation(() => Boolean)
	async register(@Arg('email') email: string, @Arg('password') password: string) {
		const hashedPassword = await hash(password, 12);

		try {
			await User.insert({
				email,
				password: hashedPassword,
			});
		} catch (err) {
			console.log('User registration failed. Reason:', err);
			return false;
		}

		return true;
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: MyContext
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });

		if (!user) throw new Error('Invalid Login');

		const valid = await compare(password, user.password);

		if (!valid) {
			throw new Error('Invalid Login');
		}

		// Refresh token cookie
		// with httpOnly set to true cookie cannot be accessed by js
		sendRefreshToken(res, createRefreshToken(user));

		// login successful, give user an access token so that stay logged in and that they can access other parts of the website
		return {
			accessToken: createAccessToken(user),
		};
	}
}
