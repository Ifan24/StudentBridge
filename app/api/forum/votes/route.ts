import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const voteSchema = z.object({
  postId: z.string().min(1),
  value: z.literal(1)
});

export async function POST(request: Request) {
  const payload = voteSchema.parse(await request.json());

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await ensureDemoUser();
    const existing = await prisma.forumVote.findUnique({
      where: { userId_postId: { userId: DEMO_USER_ID, postId: payload.postId } }
    });
    if (existing) {
      return NextResponse.json({ ok: true, persisted: true, unchanged: true });
    }
    await prisma.forumVote.create({ data: { userId: DEMO_USER_ID, postId: payload.postId, value: payload.value } });
    await prisma.forumPost.update({
      where: { id: payload.postId },
      data: { helpfulCount: { increment: payload.value } }
    });

    return NextResponse.json({ ok: true, persisted: true });
  } catch (error) {
    logServerFallback("Forum vote fell back to local state:", error);
    return NextResponse.json({ ok: true, persisted: false });
  }
}
