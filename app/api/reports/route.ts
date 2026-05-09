import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const reportSchema = z.object({
  targetType: z.enum(["post", "comment", "event", "job", "subscription"]),
  targetId: z.string().min(1),
  reason: z.string().min(3).max(280)
});

export async function POST(request: Request) {
  const payload = reportSchema.parse(await request.json());

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await ensureDemoUser();
    await prisma.report.create({
      data: {
        targetType: payload.targetType,
        targetId: payload.targetId,
        reason: payload.reason,
        userId: DEMO_USER_ID
      }
    });

    return NextResponse.json({ ok: true, persisted: true });
  } catch (error) {
    logServerFallback("Report creation fell back to local state:", error);
    return NextResponse.json({ ok: true, persisted: false });
  }
}
