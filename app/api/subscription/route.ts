import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const subscriptionSchema = z.object({
  planSlug: z.enum(["free", "plus", "pro"])
});

export async function POST(request: Request) {
  const payload = subscriptionSchema.parse(await request.json());

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, activePlanSlug: payload.planSlug, persisted: false });
  }

  try {
    await ensureDemoUser();
    const plan = await prisma.subscriptionPlan.findUnique({ where: { slug: payload.planSlug } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    await prisma.userSubscription.updateMany({
      where: { userId: DEMO_USER_ID, status: "ACTIVE" },
      data: { status: "INACTIVE", currentPeriodEnd: new Date() }
    });
    await prisma.userSubscription.create({
      data: {
        userId: DEMO_USER_ID,
        planId: plan.id,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ ok: true, activePlanSlug: payload.planSlug, persisted: true });
  } catch (error) {
    logServerFallback("Subscription update fell back to local state:", error);
    return NextResponse.json({ ok: true, activePlanSlug: payload.planSlug, persisted: false });
  }
}
