import { NextResponse } from "next/server";
import { getCityOfSydneyEvents } from "@/lib/events";

export async function GET() {
  const events = await getCityOfSydneyEvents();
  return NextResponse.json({ events, source: "city-of-sydney" });
}
