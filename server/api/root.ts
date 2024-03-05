import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return "Hello";
  }),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
