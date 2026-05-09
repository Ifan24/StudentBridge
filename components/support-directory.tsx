"use client";

import { useMemo, useState } from "react";
import { Bot, ExternalLink, Loader2, Search, ShieldCheck } from "lucide-react";
import type { AiResponse, SupportResourceView } from "@/lib/types";
import { Pill } from "@/components/ui";

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
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section>
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="flex min-h-12 items-center gap-2 rounded-md border border-line px-4">
            <Search className="h-5 w-5 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search support resources..." className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-line px-3 text-sm font-bold">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

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
      </section>

      <aside className="panel h-fit p-5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-bridge" />
          <h2 className="text-xl font-extrabold">AI support router</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">Ask what kind of support you need. StudentBridge will route you to official categories instead of giving high-stakes advice directly.</p>
        <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Example: I am unsure about my workplace pay rate..." className="mt-4 min-h-28 w-full rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-bridge" />
        <button onClick={routeSupport} className="focus-ring mt-3 inline-flex items-center gap-2 rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
          Find support
        </button>
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
