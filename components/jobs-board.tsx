"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, BriefcaseBusiness, CheckCircle2, Filter, MapPin, Search } from "lucide-react";
import type { JobOpportunityView } from "@/lib/types";
import { EmptyState, ExternalLinkButton, Pagination, Pill, VerifiedLabel } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JOB_PAGE_SIZE = 3;

export function JobsBoard({ jobs, initialSavedIds = [] }: { jobs: JobOpportunityView[]; initialSavedIds?: string[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");
  const [workType, setWorkType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [saved, setSaved] = useState<Set<string>>(() => new Set(initialSavedIds));
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const text = `${job.title} ${job.company} ${job.industry} ${job.tags.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) && (city === "All" || job.city === city) && (workType === "All" || job.workType === workType);
    });
  }, [jobs, query, city, workType]);

  const cities = ["All", ...Array.from(new Set(jobs.map((job) => job.city)))];
  const workTypes = ["All", ...Array.from(new Set(jobs.map((job) => job.workType)))];

  useEffect(() => {
    setCurrentPage(1);
  }, [query, city, workType]);

  useEffect(() => {
    const stored = window.localStorage.getItem("studentbridge:v1:applied-jobs");
    if (!stored) return;
    try {
      const ids = JSON.parse(stored) as string[];
      setApplied(new Set(ids));
    } catch {
      setApplied(new Set());
    }
  }, []);

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOB_PAGE_SIZE));
  const pageStart = (currentPage - 1) * JOB_PAGE_SIZE;
  const visibleJobs = filtered.slice(pageStart, pageStart + JOB_PAGE_SIZE);

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

  function toggleApplied(id: string) {
    setApplied((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      window.localStorage.setItem("studentbridge:v1:applied-jobs", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="panel h-fit p-5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-bridge" />
          <p className="font-extrabold">Refine your search</p>
        </div>
        <FilterSelect label="City" value={city} values={cities} onChange={setCity} />
        <FilterSelect label="Work type" value={workType} values={workTypes} onChange={setWorkType} />
        <div className="mt-6 rounded-md bg-mist p-4">
          <VerifiedLabel label="Verified opportunities only" />
          <p className="mt-3 text-sm leading-6 text-muted">Prioritise roles with clear pay, application details and student-friendly work-rights context.</p>
        </div>
      </aside>

      <section>
        <div className="mb-4 flex gap-3">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles, employers, skills or suburbs..." className="h-12 rounded-md border-line pl-11 text-sm" />
          </label>
        </div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-muted">{filtered.length} opportunities found</p>
          <p className="text-sm text-muted">Showing {filtered.length ? pageStart + 1 : 0}-{Math.min(pageStart + JOB_PAGE_SIZE, filtered.length)}</p>
        </div>
        <div className="space-y-4">
          {visibleJobs.length ? (
            visibleJobs.map((job) => (
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
                  <div className="min-w-40 space-y-3 text-sm text-muted">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.city}</div>
                    <div>{job.paid ? "Paid role" : "Volunteer opportunity"}</div>
                    <div>{job.closingDate ? `Closes ${new Date(job.closingDate).toLocaleDateString("en-AU")}` : "Ongoing"}</div>
                    <Button onClick={() => toggleSaved(job.id)} variant="outline" className="h-10 w-full rounded-md border-bridge font-extrabold text-bridge">
                      {saved.has(job.id) ? <CheckCircle2 data-icon="inline-start" /> : <Bookmark data-icon="inline-start" />}
                      {saved.has(job.id) ? "Saved" : "Save"}
                    </Button>
                    <Button onClick={() => toggleApplied(job.id)} variant={applied.has(job.id) ? "secondary" : "outline"} className="h-10 w-full rounded-md border-line font-extrabold">
                      <CheckCircle2 data-icon="inline-start" />
                      {applied.has(job.id) ? "Applied" : "Mark applied"}
                    </Button>
                    <ExternalLinkButton href={job.applyUrl}>Apply</ExternalLinkButton>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState title="No jobs found" body="Try a different city, work type or keyword to browse the job board." />
          )}
        </div>
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} label={`Page ${currentPage} of ${totalPages}`} />
      </section>

      <aside className="space-y-5 xl:col-span-2 2xl:col-span-1">
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

function FilterSelect({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <label className="mt-5 block">
      <span className="muted-label">{label}</span>
      <Select value={value} onValueChange={(nextValue) => nextValue && onChange(nextValue)}>
        <SelectTrigger className="mt-2 h-12 w-full rounded-md border-line bg-white px-3 text-sm font-bold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {values.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </label>
  );
}
