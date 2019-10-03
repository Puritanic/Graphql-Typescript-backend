import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { hash, compare } from "bcryptjs";

import { User } from "./entity/User";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hi!!!";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (err) {
      console.log("User registration failed. Reason:", err);
      return false;
    }

    return true;
  }

  @Mutation(() => Boolean)
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("Invalid Login");

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid Login");
    }

    // login successful
    return user;
  }
}
