import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware } from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';

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
		res.cookie(
			'jid',
			createRefreshToken(user),
			// with httpOnly set to true cookie cannot be accessed by js
			{ httpOnly: true }
		);

		// login successful, give user an access token so that stay logged in and that they can access other parts of the website
		return {
			accessToken: createAccessToken(user),
		};
	}
}
