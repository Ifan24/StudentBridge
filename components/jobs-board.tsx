"use client";

import { useMemo, useState } from "react";
import { Bookmark, BriefcaseBusiness, CheckCircle2, Filter, MapPin, Search } from "lucide-react";
import type { JobOpportunityView } from "@/lib/types";
import { ExternalLinkButton, Pill, VerifiedLabel } from "@/components/ui";

export function JobsBoard({ jobs }: { jobs: JobOpportunityView[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");
  const [workType, setWorkType] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const text = `${job.title} ${job.company} ${job.industry} ${job.tags.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) && (city === "All" || job.city === city) && (workType === "All" || job.workType === workType);
    });
  }, [jobs, query, city, workType]);

  const cities = ["All", ...Array.from(new Set(jobs.map((job) => job.city)))];
  const workTypes = ["All", ...Array.from(new Set(jobs.map((job) => job.workType)))];

  async function toggleSaved(id: string) {
    const next = new Set(saved);
    const isSaved = next.has(id);
    if (isSaved) next.delete(id);
    else next.add(id);
    setSaved(next);
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "job", itemId: id, saved: !isSaved })
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_360px]">
      <aside className="panel h-fit p-5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-bridge" />
          <p className="font-extrabold">Refine your search</p>
        </div>
        <Select label="City" value={city} values={cities} onChange={setCity} />
        <Select label="Work type" value={workType} values={workTypes} onChange={setWorkType} />
        <div className="mt-6 rounded-md bg-mist p-4">
          <VerifiedLabel label="Verified opportunities only" />
          <p className="mt-3 text-sm leading-6 text-muted">Prioritise roles with clear pay, application details and student-friendly work-rights context.</p>
        </div>
      </aside>

      <section>
        <div className="mb-4 flex gap-3">
          <label className="flex min-h-12 flex-1 items-center gap-2 rounded-md border border-line px-4">
            <Search className="h-5 w-5 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles, employers, skills or suburbs..." className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>
        </div>
        <div className="space-y-4">
          {filtered.map((job) => (
            <article key={job.id} className="panel p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-bridge text-white">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold">{job.title}</h3>
                    {job.verified && <VerifiedLabel />}
                  </div>
                  <p className="mt-1 font-bold text-muted">{job.company}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{job.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>{job.workType}</Pill>
                    <Pill tone="green">{job.industry}</Pill>
                    <Pill tone={job.workRightsFriendly ? "green" : "neutral"}>{job.workRightsFriendly ? "Work rights friendly" : "Check work rights"}</Pill>
                    {job.tags.map((tag) => (
                      <Pill key={tag} tone="neutral">{tag}</Pill>
                    ))}
                  </div>
                </div>
                <div className="min-w-48 space-y-3 text-sm text-muted">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.city}</div>
                  <div>{job.paid ? "Paid role" : "Volunteer opportunity"}</div>
                  <div>{job.closingDate ? `Closes ${new Date(job.closingDate).toLocaleDateString("en-AU")}` : "Ongoing"}</div>
                  <button onClick={() => toggleSaved(job.id)} className="focus-ring flex w-full items-center justify-center gap-2 rounded-md border border-bridge px-4 py-2.5 font-extrabold text-bridge">
                    {saved.has(job.id) ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {saved.has(job.id) ? "Saved" : "Save"}
                  </button>
                  <ExternalLinkButton href={job.applyUrl}>Apply</ExternalLinkButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-5">
        <div className="panel p-5">
          <p className="muted-label">Recommended for you</p>
          <h3 className="mt-2 text-xl font-extrabold">Why these roles fit</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <li>Matches IT and data career goals.</li>
            <li>Prioritises work-rights-friendly employers.</li>
            <li>Includes beginner-friendly and portfolio options.</li>
          </ul>
        </div>
        <div className="panel p-5">
          <p className="muted-label">Safe job search</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <li>No fees to apply.</li>
            <li>Check pay and conditions with Fair Work.</li>
            <li>Report suspicious listings.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <label className="mt-5 block">
      <span className="muted-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-md border border-line bg-white px-3 py-3 text-sm font-bold outline-none focus:border-bridge">
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
