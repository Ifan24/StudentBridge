import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const savedItemTypes = ["event", "post", "job", "support"] as const;

const savedSchema = z.object({
  itemType: z.enum(savedItemTypes),
  itemId: z.string().min(1),
  saved: z.boolean()
});

export async function GET(request: Request) {
  const itemType = new URL(request.url).searchParams.get("itemType");
  const parsedType = itemType ? z.enum(savedItemTypes).safeParse(itemType) : null;

  if (itemType && !parsedType?.success) {
    return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ items: [], ids: [], persisted: false });
  }

  try {
    await ensureDemoUser();
    const items = await prisma.savedItem.findMany({
      where: {
        userId: DEMO_USER_ID,
        ...(parsedType?.success ? { itemType: parsedType.data } : {})
      },
      select: { itemType: true, itemId: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      items,
      ids: items.map((item) => item.itemId),
      persisted: true
    });
  } catch (error) {
    logServerFallback("Saved item read fell back to empty state:", error);
    return NextResponse.json({ items: [], ids: [], persisted: false });
  }
}

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
