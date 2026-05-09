"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Bookmark, CalendarDays, CheckCircle2, MapPin, Search, ShieldCheck } from "lucide-react";
import type { EventItem } from "@/lib/types";
import { ExternalLinkButton, Pill } from "@/components/ui";

export function EventsBoard({ events }: { events: EventItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const categories = ["All", ...Array.from(new Set(events.map((event) => event.category)))];
  const filtered = useMemo(() => {
    return events.filter((event) => {
      const text = `${event.title} ${event.description} ${event.location} ${event.tags.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) && (category === "All" || event.category === category) && (price === "All" || (price === "Free" ? event.isFree : !event.isFree));
    });
  }, [events, query, category, price]);

  async function toggleSaved(id: string) {
    const next = new Set(saved);
    const isSaved = next.has(id);
    if (isSaved) next.delete(id);
    else next.add(id);
    setSaved(next);
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "event", itemId: id, saved: !isSaved })
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px_160px]">
          <label className="flex min-h-12 items-center gap-2 rounded-md border border-line px-4">
            <Search className="h-5 w-5 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, topics, hosts or keywords..." className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-line px-3 text-sm font-bold">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={price} onChange={(event) => setPrice(event.target.value)} className="rounded-md border border-line px-3 text-sm font-bold">
            {["All", "Free", "Paid"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-line p-5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold">Featured events</h2>
              <ShieldCheck className="h-5 w-5 text-bridge" />
              <span className="text-sm text-muted">City of Sydney What’s On source</span>
            </div>
          </div>
          <div className="divide-y divide-line">
            {filtered.map((event) => (
              <article key={event.id} className="grid gap-4 p-5 md:grid-cols-[170px_1fr_220px]">
                <div className="relative h-32 overflow-hidden rounded-md bg-mist">
                  {event.imageUrl ? <Image src={event.imageUrl} alt="" fill sizes="170px" className="object-cover" /> : <div className="grid h-full place-items-center text-sm font-bold text-muted">[event image]</div>}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold">{event.title}</h3>
                    {event.isFree && <Pill tone="green">Free</Pill>}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{event.description}</p>
                  <p className="mt-3 text-sm font-bold text-ink">{event.host}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>{event.category}</Pill>
                    {event.tags.slice(0, 3).map((tag) => <Pill key={tag} tone="neutral">{tag}</Pill>)}
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted">
                  <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {event.dateLabel}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</div>
                  <button onClick={() => toggleSaved(event.id)} className="focus-ring flex w-full items-center justify-center gap-2 rounded-md border border-bridge px-4 py-2.5 font-extrabold text-bridge">
                    {saved.has(event.id) ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {saved.has(event.id) ? "Saved" : "Save"}
                  </button>
                  <ExternalLinkButton href={event.sourceUrl}>View source</ExternalLinkButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="panel p-5">
          <p className="muted-label">This week shortlist</p>
          <div className="mt-4 space-y-3">
            {filtered.slice(0, 4).map((event) => (
              <div key={event.id} className="rounded-md border border-line p-3">
                <p className="font-extrabold">{event.title}</p>
                <p className="mt-1 text-sm text-muted">{event.dateLabel} · {event.location}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel bg-notice p-5">
          <p className="muted-label">Official listings</p>
          <p className="mt-3 text-sm leading-6 text-muted">Open the original event page before attending so you can confirm the latest time, location and booking details.</p>
        </div>
      </aside>
    </div>
  );
}
