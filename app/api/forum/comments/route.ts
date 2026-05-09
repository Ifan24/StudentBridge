import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID, highRiskTopicPattern } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const commentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(3).max(800)
});

export async function POST(request: Request) {
  const payload = commentSchema.parse(await request.json());
  const status = highRiskTopicPattern.test(payload.body) ? "NEEDS_REVIEW" : "ACTIVE";

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      comment: {
        id: `local-comment-${Date.now()}`,
        body: payload.body,
        authorName: "Ruiqi Li",
        helpfulCount: 0,
        createdAt: new Date().toISOString()
      },
      persisted: false
    });
  }

  try {
    await ensureDemoUser();
    const comment = await prisma.forumComment.create({
      data: {
        body: payload.body,
        status,
        postId: payload.postId,
        authorId: DEMO_USER_ID
      },
      include: { author: true }
    });
    await prisma.forumPost.update({
      where: { id: payload.postId },
      data: { replyCount: { increment: 1 } }
    });

    return NextResponse.json({
      comment: {
        id: comment.id,
        body: comment.body,
        authorName: comment.author.name,
        helpfulCount: comment.helpfulCount,
        createdAt: comment.createdAt.toISOString()
      },
      persisted: true
    });
  } catch (error) {
    logServerFallback("Forum comment creation fell back to local state:", error);
    return NextResponse.json({
      comment: {
        id: `local-comment-${Date.now()}`,
        body: payload.body,
        authorName: "Ruiqi Li",
        helpfulCount: 0,
        createdAt: new Date().toISOString()
      },
      persisted: false
    });
  }
}
