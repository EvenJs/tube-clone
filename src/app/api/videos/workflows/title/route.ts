import { TITLE_SYSTEM_PROMPT } from "@/constants";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { eq, and } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}


export const { POST } = serve(
  async (context) => {
    const input = context.requestPayload as InputType;
    const { userId, videoId } = input

    const video = await context.run("get-video", async () => {
      const [existingVideo] = await db.select().from(videos)
        .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new Error("Not found")
      }
      return existingVideo;
    })

    const { body } = await context.api.openai.call("generate-title", {
      token: process.env.OPENAI_API_KAY!,
      operation: "chat.completions.create",
      body: {
        model: "gpt-4o",
        messages: [{
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        }, {
          role: "user",
          content: "Hello everyone."
        }]
      }
    })

    const title = body.choices[0]?.message.content;


    await context.run("update-video", async () => {
      await db.update(videos).set({
        title: title || video.title,
      })
        .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)))

    })

    // await context.run("second-step", () => {
    //   console.log("second step ran")
    // })
  }
)