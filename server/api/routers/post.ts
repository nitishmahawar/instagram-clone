import { createPostSchema, deletePostSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const { description, imageUrl } = input;

      const post = await prisma.post.create({
        data: { imageUrl, description, authorId: session.user.id },
      });

      return post;
    }),
  deletePost: protectedProcedure
    .input(deletePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { postId } = input;

      const post = await prisma.post.delete({
        where: { id: postId, authorId: session.user.id },
      });

      return post;
    }),
  getPosts: protectedProcedure.query(async ({ ctx, input }) => {
    const { prisma, session } = ctx;

    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return posts;
  }),
  like: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { postId } = input;

      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      await prisma.like.create({ data: { postId, userId: session.user.id } });
      await prisma.post.update({
        where: { id: postId },
        data: { totalLikes: post.totalLikes + 1 },
      });
      return null;
    }),
});
