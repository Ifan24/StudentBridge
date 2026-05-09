"use client";

import { useMemo, useState } from "react";
import { Bot, ExternalLink, Loader2, Search, ShieldCheck } from "lucide-react";
import type { AiResponse, SupportResourceView } from "@/lib/types";
import { EmptyState, Pill } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function SupportDirectory({ resources }: { resources: SupportResourceView[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = ["All", ...Array.from(new Set(resources.map((resource) => resource.category)))];
  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const text = `${resource.title} ${resource.description} ${resource.tags.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) && (category === "All" || resource.category === category);
    });
  }, [resources, query, category]);

  async function routeSupport() {
    if (!question.trim()) return;
    setLoading(true);
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "supportRouter", message: question })
    });
    setAnswer(await response.json());
    setLoading(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
      <section>
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search support resources..." className="h-12 rounded-md border-line pl-11 text-sm" />
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
        </div>

        {filtered.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((resource) => (
              <article key={resource.id} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Pill tone="green">{resource.category}</Pill>
                    <h3 className="mt-3 text-xl font-extrabold">{resource.title}</h3>
                  </div>
                  {resource.official && <ShieldCheck className="h-5 w-5 text-eucalypt" />}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{resource.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resource.tags.map((tag) => <Pill key={tag} tone="neutral">{tag}</Pill>)}
                </div>
                <a href={resource.url} target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md border border-bridge px-4 py-2.5 text-sm font-extrabold text-bridge">
                  Open official source <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No resources found" body="Try a different category or search term to browse the demo support directory." />
        )}
      </section>

      <aside className="panel h-fit p-5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-bridge" />
          <h2 className="text-xl font-extrabold">AI support router</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">Ask what kind of support you need. StudentBridge will route you to official categories instead of giving high-stakes advice directly.</p>
        <Textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Example: I am unsure about my workplace pay rate..." className="mt-4 min-h-28 rounded-md border-line px-3 py-3 text-sm" />
        <Button onClick={routeSupport} className="mt-3 h-12 rounded-md px-5 text-sm font-extrabold">
          {loading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Bot data-icon="inline-start" />}
          Find support
        </Button>
        {answer && (
          <div className="mt-5 rounded-md bg-mist p-4">
            <p className="font-extrabold">{answer.summary}</p>
            {answer.safetyNote && <p className="mt-2 text-sm leading-6 text-amber">{answer.safetyNote}</p>}
            <div className="mt-4 space-y-3">
              {answer.cards.map((card) => (
                <div key={card.title} className="rounded-md bg-white p-3">
                  <p className="text-sm font-extrabold">{card.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
