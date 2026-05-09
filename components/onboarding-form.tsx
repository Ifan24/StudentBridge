"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { StudentProfileView } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const goalOptions = ["Make friends", "Find work", "Join forum topics", "Find job opportunities", "Volunteer", "Get support"];
const eventOptions = ["Networking", "Career", "Workshop", "Community", "Free", "Online"];
const languageOptions = ["English", "Mandarin", "Hindi", "Nepali", "Vietnamese", "Spanish"];

export function OnboardingForm({ profile }: { profile: StudentProfileView }) {
  const [form, setForm] = useState(profile);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const planPreview = useMemo(() => {
    const actions = [
      `Find ${form.city || "local"} events connected to ${form.studyArea || "your study area"}.`,
      `Follow forum topics for ${form.goals.slice(0, 2).join(" and ") || "student life"}.`,
      `Shortlist work-rights-friendly jobs for ${form.arrivalStage || "your current stage"}.`
    ];
    return actions;
  }, [form]);

  async function saveProfile() {
    setStatus("saving");
    localStorage.setItem("studentbridge:v1:profile", JSON.stringify(form));
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setStatus("saved");
  }

  function toggleValue(field: "goals" | "languages" | "preferredEventTypes", value: string) {
    setForm((current) => {
      const values = current[field];
      return {
        ...current,
        [field]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
      };
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_340px]">
      <aside className="panel h-fit p-5">
        <p className="muted-label">Profile steps</p>
        {["City and campus", "Goals", "Languages", "Event types", "Plan preview"].map((step, index) => (
          <div key={step} className="mt-5 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-mist text-sm font-extrabold text-bridge">{index + 1}</div>
            <span className="text-sm font-bold">{step}</span>
          </div>
        ))}
      </aside>

      <section className="panel p-5 xl:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} />
          <Field label="Institution" value={form.institution} onChange={(institution) => setForm({ ...form, institution })} />
          <Field label="Study area" value={form.studyArea} onChange={(studyArea) => setForm({ ...form, studyArea })} />
          <Field label="Arrival stage" value={form.arrivalStage} onChange={(arrivalStage) => setForm({ ...form, arrivalStage })} />
        </div>

        <ChoiceGroup title="Goals" values={goalOptions} selected={form.goals} onToggle={(value) => toggleValue("goals", value)} />
        <ChoiceGroup title="Languages" values={languageOptions} selected={form.languages} onToggle={(value) => toggleValue("languages", value)} />
        <ChoiceGroup title="Preferred event types" values={eventOptions} selected={form.preferredEventTypes} onToggle={(value) => toggleValue("preferredEventTypes", value)} />

        <Button onClick={saveProfile} className="mt-8 h-12 rounded-md px-5 text-sm font-extrabold">
          {status === "saving" ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <CheckCircle2 data-icon="inline-start" />}
          {status === "saved" ? "Profile saved" : "Save profile"}
        </Button>
      </section>

      <aside className="panel h-fit p-5 xl:col-span-2 2xl:col-span-1">
        <p className="muted-label">Live first-week plan</p>
        <h3 className="mt-3 text-2xl font-extrabold">Your starter path</h3>
        <div className="mt-5 space-y-4">
          {planPreview.map((action) => (
            <div key={action} className="rounded-md border border-line bg-mist p-4 text-sm leading-6 text-muted">
              {action}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="muted-label">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 rounded-md border-line px-4 text-sm" />
    </label>
  );
}

function ChoiceGroup({ title, values, selected, onToggle }: { title: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="mt-7">
      <p className="muted-label">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => {
          const active = selected.includes(value);
          return (
            <Button key={value} type="button" variant={active ? "secondary" : "outline"} onClick={() => onToggle(value)} className={`rounded-md border px-3 py-2 text-sm font-bold ${active ? "border-bridge bg-blue-50 text-bridge" : "border-line bg-white text-muted"}`}>
              {value}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
