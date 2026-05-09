import { fallbackEvents } from "@/lib/mock-data";
import { hasDatabaseUrl, logServerFallback, prisma } from "@/lib/prisma";
import type { EventItem } from "@/lib/types";

type WhatsonHit = {
  objectID?: string;
  slug?: string;
  name?: string;
  strapline?: string;
  dates?: string[];
  upcomingDate?: string;
  freeEvent?: boolean;
  categories?: string[];
  tags?: string[];
  suburbName?: string;
  venueName?: string;
  regions?: string[];
  tileImageCloudinary?: Array<{ secure_url?: string; url?: string }>;
};

const cacheKey = "city-of-sydney:next-thirty";

export async function getCityOfSydneyEvents(): Promise<EventItem[]> {
  const cached = await readCachedEvents();
  if (cached.length) return cached;

  try {
    const events = await fetchWhatsonEvents();
    if (events.length) {
      await writeCachedEvents(events);
      return events;
    }
  } catch (error) {
    logServerFallback("City of Sydney events unavailable, using fallback events:", error);
  }

  return fallbackEvents;
}

async function readCachedEvents() {
  if (!hasDatabaseUrl()) return [];
  try {
    const row = await prisma.eventCache.findUnique({ where: { cacheKey } });
    if (!row || row.expiresAt < new Date()) return [];
    return Array.isArray(row.data) ? (row.data as unknown as EventItem[]) : [];
  } catch {
    return [];
  }
}

async function writeCachedEvents(events: EventItem[]) {
  if (!hasDatabaseUrl()) return;
  try {
    await prisma.eventCache.upsert({
      where: { cacheKey },
      update: {
        data: events,
        fetchedAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      },
      create: {
        cacheKey,
        data: events,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });
  } catch (error) {
    logServerFallback("Unable to write event cache:", error);
  }
}

async function fetchWhatsonEvents(): Promise<EventItem[]> {
  const baseUrl = process.env.CITY_OF_SYDNEY_EVENTS_URL ?? "https://whatson.cityofsydney.nsw.gov.au/";
  const url = new URL(baseUrl);
  url.searchParams.set("time", "next-thirty");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "StudentBridge prototype event adapter"
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`City of Sydney returned ${response.status}`);
  }

  const html = await response.text();
  const jsonMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!jsonMatch) throw new Error("Could not find What’s On payload");

  const payload = JSON.parse(jsonMatch[1]) as {
    props?: {
      pageProps?: {
        searchResults?: {
          hits?: WhatsonHit[];
        };
      };
    };
  };
  const hits = payload.props?.pageProps?.searchResults?.hits ?? [];
  return hits.slice(0, 40).map(normalizeHit).filter(Boolean) as EventItem[];
}

function normalizeHit(hit: WhatsonHit): EventItem | null {
  if (!hit.name || !hit.slug) return null;
  const nextDate = hit.upcomingDate ?? hit.dates?.find(Boolean);
  const dateLabel = nextDate
    ? new Intl.DateTimeFormat("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(nextDate))
    : "Date to be confirmed";
  const category = toTitle(hit.categories?.[0] ?? "Event");
  const sourceUrl = `https://whatson.cityofsydney.nsw.gov.au/events/${hit.slug}`;

  return {
    id: hit.objectID ?? hit.slug,
    title: hit.name,
    description: hit.strapline ?? "Student-friendly event from City of Sydney What’s On.",
    dateLabel,
    nextDate,
    location: hit.venueName || hit.suburbName || "Sydney",
    city: hit.regions?.includes("online") ? "Online" : "Sydney",
    category,
    isFree: Boolean(hit.freeEvent),
    host: "City of Sydney What’s On",
    imageUrl: (hit.tileImageCloudinary?.[0]?.secure_url ?? hit.tileImageCloudinary?.[0]?.url)?.replace("http://", "https://"),
    sourceUrl,
    tags: [...(hit.categories ?? []), ...(hit.tags ?? [])].slice(0, 5).map(toTitle)
  };
}

function toTitle(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace("And", "&");
}
