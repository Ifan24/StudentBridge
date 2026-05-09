import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_USER_ID } from "@/lib/constants";
import { ensureDemoUser } from "@/lib/data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";

const profileSchema = z.object({
  city: z.string().min(1),
  institution: z.string().min(1),
  studyArea: z.string().min(1),
  arrivalStage: z.string().min(1),
  goals: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  preferredEventTypes: z.array(z.string()).min(1)
});

export async function POST(request: Request) {
  const payload = profileSchema.parse(await request.json());

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ profile: { id: "local-profile", ...payload }, persisted: false });
  }

  try {
    await ensureDemoUser();
    const profile = await prisma.studentProfile.upsert({
      where: { userId: DEMO_USER_ID },
      update: payload,
      create: { ...payload, userId: DEMO_USER_ID }
    });

    return NextResponse.json({ profile, persisted: true });
  } catch (error) {
    logServerFallback("Profile save fell back to local state:", error);
    return NextResponse.json({ profile: { id: "local-profile", ...payload }, persisted: false });
  }
}
