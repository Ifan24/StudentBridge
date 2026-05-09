"use client";

import { FormEvent, useState } from "react";
import { Bot, Loader2, Send, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import type { AiResponse } from "@/lib/types";
import { Pill } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const intents = [
  { value: "onboardingPlan", label: "Starter plan" },
  { value: "recommendEvents", label: "Event ideas" },
  { value: "recommendJobs", label: "Job fit" },
  { value: "summariseForum", label: "Forum summary" },
  { value: "pitchHelper", label: "Pitch helper" },
  { value: "supportRouter", label: "Support router" }
] as const;

type IntentValue = (typeof intents)[number]["value"];

const defaultInstructions: Record<IntentValue, string> = {
  onboardingPlan: "I am new to Sydney and studying IT. Give me a simple first-week StudentBridge plan.",
  recommendEvents: "Recommend beginner-friendly events in Sydney for an international student. Explain which one is best for networking, study confidence and making friends.",
  recommendJobs: "Which beginner-friendly job opportunities should an IT student look at first? Compare fit, skills to mention and what to do next.",
  summariseForum: "Summarise the most useful StudentBridge forum discussions right now and suggest which thread I should read or join first.",
  pitchHelper: "Help me write a short introduction for a student networking event, plus one follow-up question I can ask.",
  supportRouter: "I need help finding official support for work rights, wellbeing, study or safety. Point me to the right StudentBridge support path."
};

const quickPrompts: Array<{ intent: IntentValue; title: string; prompt: string }> = [
  {
    intent: "onboardingPlan",
    title: "First-week plan",
    prompt: defaultInstructions.onboardingPlan
  },
  {
    intent: "recommendJobs",
    title: "Job fit",
    prompt: defaultInstructions.recommendJobs
  },
  {
    intent: "pitchHelper",
    title: "Networking intro",
    prompt: defaultInstructions.pitchHelper
  },
  {
    intent: "supportRouter",
    title: "Find support",
    prompt: defaultInstructions.supportRouter
  }
];

export function AiGuide() {
  const [intent, setIntent] = useState<IntentValue>("onboardingPlan");
  const [message, setMessage] = useState(defaultInstructions.onboardingPlan);
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function askGuide(nextIntent = intent, nextMessage = message) {
    const trimmedMessage = nextMessage.trim();
    if (!trimmedMessage) return;
    setLoading(true);
    setError("");
    setResponse(null);
    setStreamText("");
    try {
      const result = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: nextIntent, message: trimmedMessage })
      });

      if (!result.ok || !result.body) {
        await askGuideFallback(nextIntent, trimmedMessage);
        return;
      }

      const reader = result.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          handleStreamEvent(event);
        }
      }
    } catch {
      await askGuideFallback(nextIntent, trimmedMessage);
    } finally {
      setLoading(false);
    }
  }

  async function askGuideFallback(nextIntent: IntentValue, nextMessage: string) {
    try {
      const result = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: nextIntent, message: nextMessage })
      });
      const data = await result.json();
      if (!result.ok && !data.summary) {
        throw new Error(data.error ?? "AI Guide could not respond.");
      }
      setResponse(data as AiResponse);
      setStreamText(data.summary ?? "");
    } catch {
      setError("AI Guide could not answer right now. Try a shorter question or use one of the prompts.");
    }
  }

  function handleStreamEvent(event: string) {
    const eventType = event
      .split(/\r?\n/)
      .find((line) => line.startsWith("event:"))
      ?.replace(/^event:\s?/, "");
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:\s?/, ""))
      .join("\n");

    if (!eventType || !data) return;

    if (eventType === "token") {
      const payload = JSON.parse(data) as { text?: string };
      if (payload.text) {
        setStreamText((current) => current + payload.text);
      }
      return;
    }

    if (eventType === "final") {
      const parsed = JSON.parse(data) as AiResponse;
      setResponse(parsed);
      const liveBody = parsed.cards.find((card) => card.source === "ai")?.body;
      if (liveBody) {
        setStreamText(liveBody);
      }
    }

    if (eventType === "error") {
      const payload = JSON.parse(data) as { message?: string };
      setError(payload.message ?? "AI Guide could not answer right now.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await askGuide();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="panel p-5 xl:p-7">
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
            <Button
              key={item.value}
              type="button"
              variant={intent === item.value ? "secondary" : "outline"}
              onClick={() => {
                setIntent(item.value);
                setMessage(defaultInstructions[item.value]);
              }}
              className={`rounded-md px-4 py-2 text-sm font-extrabold ${intent === item.value ? "bg-blue-50 text-bridge" : "border-line text-muted"}`}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6">
          <Textarea
            name="message"
            required
            minLength={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell StudentBridge what you need help with..."
            className="min-h-48 rounded-md border-line px-4 py-4 text-sm leading-6"
          />
          <Button type="submit" className="mt-4 h-12 rounded-md px-5 text-sm font-extrabold">
            {loading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Send data-icon="inline-start" />}
            Ask AI Guide
          </Button>
        </form>

        {error && <p className="mt-4 rounded-md border border-red-100 bg-red-50 p-3 text-sm font-bold text-danger">{error}</p>}

        {(streamText || loading) && (
          <div className="mt-7 rounded-md border border-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-bridge">{loading ? "Streaming response" : "Stream complete"}</p>
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-bridge" /> : <Sparkles className="h-4 w-4 text-violet" />}
            </div>
            <p className="whitespace-pre-line text-base leading-7 text-ink">{streamText || "Connecting to AI Guide..."}</p>
          </div>
        )}

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
          <div className="mt-4 grid gap-3">
            {quickPrompts.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setIntent(item.intent);
                  setMessage(item.prompt);
                  void askGuide(item.intent, item.prompt);
                }}
                className="focus-ring rounded-md border border-line bg-white p-3 text-left transition hover:border-bridge hover:bg-mist"
              >
                <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <Wand2 className="h-4 w-4 text-bridge" />
                  {item.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-mutedText">{item.prompt}</span>
              </button>
            ))}
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
