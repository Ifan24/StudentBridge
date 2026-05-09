"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, CalendarDays, CheckCircle2, MapPin, Search, ShieldCheck } from "lucide-react";
import type { EventItem } from "@/lib/types";
import { EmptyState, ExternalLinkButton, Pagination, Pill } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EVENT_PAGE_SIZE = 6;

export function EventsBoard({ events }: { events: EventItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const categories = ["All", ...Array.from(new Set(events.map((event) => event.category)))];
  const filtered = useMemo(() => {
    return events.filter((event) => {
      const text = `${event.title} ${event.description} ${event.location} ${event.tags.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) && (category === "All" || event.category === category) && (price === "All" || (price === "Free" ? event.isFree : !event.isFree));
    });
  }, [events, query, category, price]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, price]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / EVENT_PAGE_SIZE));
  const pageStart = (currentPage - 1) * EVENT_PAGE_SIZE;
  const visibleEvents = filtered.slice(pageStart, pageStart + EVENT_PAGE_SIZE);

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
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <section>
        <div className="mb-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_160px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, topics, hosts or keywords..." className="h-12 rounded-md border-line pl-11 text-sm" />
          </label>
          <Select value={category} onValueChange={(value) => value && setCategory(value)}>
            <SelectTrigger className="h-12 w-full rounded-md border-line px-3 text-sm font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={price} onValueChange={(value) => value && setPrice(value)}>
            <SelectTrigger className="h-12 w-full rounded-md border-line px-3 text-sm font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["All", "Free", "Paid"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-line p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold">Featured events</h2>
                <ShieldCheck className="h-5 w-5 text-bridge" />
                <span className="text-sm text-muted">City of Sydney What’s On source</span>
              </div>
              <span className="text-sm font-bold text-muted">
                {filtered.length ? `${pageStart + 1}-${Math.min(pageStart + EVENT_PAGE_SIZE, filtered.length)} of ${filtered.length}` : "0 results"}
              </span>
            </div>
          </div>
          {visibleEvents.length ? (
            <div className="divide-y divide-line">
              {visibleEvents.map((event) => (
                <article key={event.id} className="grid gap-4 p-5 lg:grid-cols-[150px_minmax(0,1fr)] 2xl:grid-cols-[150px_minmax(0,1fr)_190px]">
                  <div className="relative h-36 overflow-hidden rounded-md bg-mist lg:h-32">
                    {event.imageUrl ? <Image src={event.imageUrl} alt="" fill sizes="(min-width: 1536px) 150px, 33vw" className="object-cover" /> : <div className="grid h-full place-items-center text-sm font-bold text-muted">[event image]</div>}
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
                  <div className="space-y-3 text-sm text-muted lg:col-span-2 lg:grid lg:grid-cols-[1fr_1fr_auto_auto] lg:items-center lg:gap-3 lg:space-y-0 2xl:col-span-1 2xl:block 2xl:space-y-3">
                    <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {event.dateLabel}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</div>
                    <Button onClick={() => toggleSaved(event.id)} variant="outline" className="h-10 w-full rounded-md border-bridge font-extrabold text-bridge">
                      {saved.has(event.id) ? <CheckCircle2 data-icon="inline-start" /> : <Bookmark data-icon="inline-start" />}
                      {saved.has(event.id) ? "Saved" : "Save"}
                    </Button>
                    <ExternalLinkButton href={event.sourceUrl}>View source</ExternalLinkButton>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-5">
              <EmptyState title="No events found" body="Try another category, price filter or search term to browse the demo event directory." />
            </div>
          )}
        </div>
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} label={`Page ${currentPage} of ${totalPages}`} />
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
