import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { videoViews } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideo] = await db
        .select()
        .from(videoViews)
        .where(and(eq(videoViews.videoId, videoId), eq(videoViews.userId, userId)));

      if (existingVideo) return existingVideo

      const [createdVideoView] = await db
        .insert(videoViews)
        .values({ userId, videoId })
        .returning();

      return createdVideoView;
    })
})