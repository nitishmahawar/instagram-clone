import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  followUser: protectedProcedure
    .input(z.object({ userToFollowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { userToFollowId } = input;

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          following: {
            connect: {
              id: userToFollowId,
            },
          },
        },
      });
      return null;
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ userToUnfollowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { userToUnfollowId } = input;

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          following: {
            disconnect: {
              id: userToUnfollowId,
            },
          },
        },
      });
      return null;
    }),
});
