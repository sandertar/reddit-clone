import { Resolver, InputType, Ctx, Int, Arg, Mutation, Field, ObjectType } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";
import { Context } from "../types";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { username, password}: UsernamePasswordInput,
    @Ctx() { em }: Context,
  ): Promise<UserResponse> {
    try {
      const user = em.create(User, { username, password: await argon2.hash(password) });
      await em.persistAndFlush(user);
      return { user };
    } catch (error) {
      const errors = [];
      if ((error as any).code === "23505") {
        errors.push({ field: "username", message: "username already exists" });
      }
      return {
        errors,
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") { username, password}: UsernamePasswordInput,
    @Ctx() { em }: Context,
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [{ field: "username", message: "that username doesn't exist" }],
      }
    }
    const valid = await argon2.verify(user.password, password);
     if (!valid) {
      return {
        errors: [{ field: "password", message: "incorrect password" }],
      }
    }
    return {
      user,
    };
  }
}
