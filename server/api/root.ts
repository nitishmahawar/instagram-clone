import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { postRouter } from "./routers/post";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
