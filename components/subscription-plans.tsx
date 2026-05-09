"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Gauge, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { SubscriptionStateView } from "@/lib/types";
import { Pill } from "@/components/ui";

export function SubscriptionPlans({ state }: { state: SubscriptionStateView }) {
  const [activePlanSlug, setActivePlanSlug] = useState(state.activePlanSlug);
  const [savingPlan, setSavingPlan] = useState<string | null>(null);
  const activePlan = useMemo(
    () => state.plans.find((plan) => plan.slug === activePlanSlug) ?? state.plans[0],
    [activePlanSlug, state.plans]
  );
  const usagePercent = Math.min(100, Math.round((state.aiUsedThisMonth / activePlan.aiMonthlyLimit) * 100));

  async function choosePlan(planSlug: string) {
    setSavingPlan(planSlug);
    await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planSlug })
    });
    setActivePlanSlug(planSlug);
    setSavingPlan(null);
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_360px]">
      <section className="grid gap-5 md:grid-cols-3">
        {state.plans.map((plan) => {
          const active = plan.slug === activePlanSlug;
          return (
            <article key={plan.slug} className={`relative rounded-lg border p-5 ${plan.highlighted ? "border-bridge shadow-soft" : "border-line"} ${active ? "bg-blue-50/40" : "bg-white"}`}>
              {plan.highlighted && <Pill tone="violet">Recommended</Pill>}
              <h2 className="mt-4 text-2xl font-extrabold">{plan.name}</h2>
              <p className="mt-2 min-h-16 text-sm leading-6 text-muted">{plan.description}</p>
              <div className="mt-5 flex items-end gap-1 whitespace-nowrap">
                <span className="text-3xl font-extrabold xl:text-4xl">{plan.priceMonthlyCents === 0 ? "$0" : `$${(plan.priceMonthlyCents / 100).toFixed(2)}`}</span>
                <span className="pb-2 text-sm font-bold text-muted">/ month</span>
              </div>
              <div className="mt-5 rounded-md bg-mist p-4">
                <div className="flex items-center gap-2 text-sm font-extrabold">
                  <Zap className="h-4 w-4 text-bridge" />
                  {plan.aiMonthlyLimit} AI Guide uses / month
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-eucalypt" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => choosePlan(plan.slug)}
                disabled={active || Boolean(savingPlan)}
                className={`focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-extrabold ${
                  active ? "bg-eucalypt text-white" : "bg-bridge text-white hover:bg-blue-700"
                } disabled:cursor-default disabled:opacity-80`}
              >
                {savingPlan === plan.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : active ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                {active ? "Current plan" : plan.priceMonthlyCents === 0 ? "Switch to Free" : "Choose plan"}
              </button>
            </article>
          );
        })}
      </section>

      <aside className="space-y-5">
        <div className="panel p-5">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-bridge" />
            <h3 className="text-xl font-extrabold">AI usage</h3>
          </div>
          <p className="mt-2 text-sm text-muted">{state.periodLabel}</p>
          <div className="mt-5">
            <div className="flex justify-between text-sm font-bold">
              <span>{state.aiUsedThisMonth} used</span>
              <span>{activePlan.aiMonthlyLimit} included</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-mist">
              <div className="h-full rounded-full bg-bridge" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Premium unlocks more AI planning, pitch coaching, forum summarising and job-fit explanations. Core safety and official support resources remain free.
          </p>
        </div>

        <div className="panel bg-notice p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber" />
            <h3 className="text-xl font-extrabold">What stays free</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Events, forum discussions, job browsing and official support links remain available on every plan.
          </p>
        </div>
      </aside>
    </div>
  );
}
