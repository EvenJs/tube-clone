// import { z } from "zod"
// import { eq, and, or, lt, desc } from "drizzle-orm";

import { mux } from "@/lib/mux"
import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [{
          generated_subtitles: [{
            language_code: "en",
            name: "English",
          }]
        }],
      },
      cors_origin: "standard", // TODO: In production change it to your url
    })

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video: video,
      url: upload.url
    }
  })
})