import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const savedSchema = z.object({
  itemType: z.enum(["event", "post", "job", "support"]),
  itemId: z.string().min(1),
  saved: z.boolean()
});

export async function POST(request: Request) {
  const payload = savedSchema.parse(await request.json());

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await ensureDemoUser();
    if (!payload.saved) {
      await prisma.savedItem.deleteMany({
        where: { userId: DEMO_USER_ID, itemType: payload.itemType, itemId: payload.itemId }
      });
    } else {
      await prisma.savedItem.upsert({
        where: { userId_itemType_itemId: { userId: DEMO_USER_ID, itemType: payload.itemType, itemId: payload.itemId } },
        update: {},
        create: { userId: DEMO_USER_ID, itemType: payload.itemType, itemId: payload.itemId }
      });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch (error) {
    logServerFallback("Saved item update fell back to local state:", error);
    return NextResponse.json({ ok: true, persisted: false });
  }
}
