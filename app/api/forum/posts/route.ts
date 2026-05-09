import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID, highRiskTopicPattern } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { mockTopics } from "@/lib/mock-data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const postSchema = z.object({
  title: z.string().min(8).max(140),
  body: z.string().min(10).max(1200),
  city: z.string().min(1),
  topicSlug: z.string().min(1),
  tags: z.array(z.string()).default([])
});

export async function POST(request: Request) {
  const payload = postSchema.parse(await request.json());
  const status = highRiskTopicPattern.test(`${payload.title} ${payload.body}`) ? "NEEDS_REVIEW" : "ACTIVE";

  if (!hasDatabaseUrl()) {
    return localPostResponse(payload, status);
  }

  try {
    await ensureDemoUser();
    const topic = await prisma.forumTopic.findUnique({ where: { slug: payload.topicSlug } });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const post = await prisma.forumPost.create({
      data: {
        title: payload.title,
        body: payload.body,
        city: payload.city,
        tags: payload.tags,
        status,
        topicId: topic.id,
        authorId: DEMO_USER_ID
      },
      include: { topic: true, author: true, comments: true }
    });

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        body: post.body,
        city: post.city,
        tags: post.tags,
        status: post.status,
        helpfulCount: post.helpfulCount,
        replyCount: 0,
        topic: post.topic,
        authorName: post.author.name,
        comments: [],
        createdAt: post.createdAt.toISOString()
      },
      persisted: true
    });
  } catch (error) {
    logServerFallback("Forum post creation fell back to local state:", error);
    return localPostResponse(payload, status);
  }
}

function localPostResponse(payload: z.infer<typeof postSchema>, status: "ACTIVE" | "NEEDS_REVIEW") {
  const topic = mockTopics.find((item) => item.slug === payload.topicSlug) ?? mockTopics[0];
  return NextResponse.json({
    post: {
      id: `local-${Date.now()}`,
      title: payload.title,
      body: payload.body,
      city: payload.city,
      tags: payload.tags,
      status,
      helpfulCount: 0,
      replyCount: 0,
      topic,
      authorName: "Ruiqi Li",
      comments: [],
      createdAt: new Date().toISOString()
    },
    persisted: false
  });
}
