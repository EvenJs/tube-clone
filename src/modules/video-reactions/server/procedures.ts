import { z } from "zod"
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { videoReactions } from "@/db/schema";
import { db } from "@/db";

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideoReaction] = await db
        .select()
        .from(videoReactions)
        .where(and(
          eq(videoReactions.videoId, videoId),
          eq(videoReactions.userId, userId),
          eq(videoReactions.type, "like")
        ));

      if (existingVideoReaction) {
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
          ))
          .returning();

        return deletedViewerReaction;
      }

      const [createdVideoReaction] = await db
        .insert(videoReactions)
        .values({ userId, videoId, type: "like" })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "like",
          }
        })
        .returning();

      return createdVideoReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideoReactionDislike] = await db
        .select()
        .from(videoReactions)
        .where(and(
          eq(videoReactions.videoId, videoId),
          eq(videoReactions.userId, userId),
          eq(videoReactions.type, "dislike")
        ));

      if (existingVideoReactionDislike) {
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
          ))
          .returning();

        return deletedViewerReaction;
      }

      const [createdVideoReaction] = await db
        .insert(videoReactions)
        .values({ userId, videoId, type: "dislike" })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "dislike",
          }
        })
        .returning();

      return createdVideoReaction;
    })
})