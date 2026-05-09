"use client";

import { FormEvent, useState } from "react";
import { Bot, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";
import type { AiResponse } from "@/lib/types";
import { Pill } from "@/components/ui";

const intents = [
  { value: "onboardingPlan", label: "Starter plan" },
  { value: "recommendEvents", label: "Event ideas" },
  { value: "recommendJobs", label: "Job fit" },
  { value: "summariseForum", label: "Forum summary" },
  { value: "pitchHelper", label: "Pitch helper" },
  { value: "supportRouter", label: "Support router" }
] as const;

export function AiGuide() {
  const [intent, setIntent] = useState<(typeof intents)[number]["value"]>("onboardingPlan");
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get("message") ?? "");
    setLoading(true);
    const result = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent, message })
    });
    setResponse(await result.json());
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="panel p-5 lg:p-7">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-bridge text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">StudentBridge AI Guide</h2>
            <p className="text-sm text-muted">Turn your goals into next steps, introductions, job-fit notes and support routes.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {intents.map((item) => (
            <button key={item.value} onClick={() => setIntent(item.value)} className={`focus-ring rounded-md border px-4 py-2 text-sm font-extrabold ${intent === item.value ? "border-bridge bg-blue-50 text-bridge" : "border-line text-muted"}`}>
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6">
          <textarea name="message" required minLength={3} placeholder="Tell StudentBridge what you need help with..." className="min-h-48 w-full rounded-md border border-line px-4 py-4 text-sm leading-6 outline-none focus:border-bridge" />
          <button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Ask AI Guide
          </button>
        </form>

        {response && (
          <div className="mt-7 rounded-md border border-line bg-mist p-5">
            <p className="text-xl font-extrabold">{response.summary}</p>
            {response.safetyNote && <p className="mt-2 text-sm leading-6 text-amber">{response.safetyNote}</p>}
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {response.cards.map((card) => (
                <div key={card.title} className="rounded-md bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-extrabold">{card.title}</h3>
                    <Pill tone={card.source === "official-link" ? "green" : card.source === "city-of-sydney" ? "blue" : "violet"}>{sourceLabel(card.source)}</Pill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
                  {card.actionLabel && <p className="mt-3 text-sm font-extrabold text-bridge">{card.actionLabel}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <aside className="space-y-5">
        <div className="panel p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet" />
            <h3 className="text-xl font-extrabold">Quick prompts</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <p>Build my first-week plan for Sydney.</p>
            <p>Which job listing fits an IT student?</p>
            <p>Help me write a short networking intro.</p>
            <p>Where should I go for work-rights questions?</p>
          </div>
        </div>
        <div className="panel bg-notice p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber" />
            <h3 className="text-xl font-extrabold">Trusted support</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">For legal, migration, medical or financial questions, StudentBridge points you to official services and qualified support.</p>
        </div>
      </aside>
    </div>
  );
}

function sourceLabel(source: AiResponse["cards"][number]["source"]) {
  const labels = {
    "app-data": "StudentBridge",
    "city-of-sydney": "City events",
    "official-link": "Official",
    ai: "AI Guide"
  };
  return labels[source] ?? "StudentBridge";
}
