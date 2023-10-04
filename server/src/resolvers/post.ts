import { Resolver, Query, Ctx, Int, Arg, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { Context } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: Context): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: Context,
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post, { nullable: true })
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: Context,
  ): Promise<Post | null> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("title", () => String) title: string,
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: Context,
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    } else {
      post.title = title;
      await em.persistAndFlush(post);
      return post;
    }
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: Context,
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
