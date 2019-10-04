import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "./entity/User";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("Invalid Login");

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid Login");
    }

    // login successful, give user an access token so that stay logged in and that they can access other parts of the website
    return {
      accessToken: sign({ userId: user.id }, "your-jwt-secret-here", {
        expiresIn: "15m"
      })
    };
  }
}
