"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, GraduationCap, LockKeyhole, Mail, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "login" | "signup";

type DemoIdentity = {
  name: string;
  email: string;
  institution: string;
  studyArea: string;
  arrivalStage: string;
};

const demoIdentities: DemoIdentity[] = [
  {
    name: "Maya Chen",
    email: "maya.chen@studentbridge.test",
    institution: "University of Technology Sydney",
    studyArea: "Information Technology",
    arrivalStage: "Arrived this month"
  },
  {
    name: "Arjun Patel",
    email: "arjun.patel@studentbridge.test",
    institution: "TAFE NSW",
    studyArea: "Business Analytics",
    arrivalStage: "Settling into Sydney"
  }
];

const arrivalStages = ["Arrived this month", "Planning first semester", "Settling into Sydney"];

export function FakeAuthScreen({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1360px] items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-md">
            <Image src="/brand/studentbridge-mark-app.png" alt="" width={44} height={44} priority className="h-11 w-11 rounded-md object-cover shadow-soft" />
            <span className="truncate text-xl font-extrabold tracking-normal">StudentBridge</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={isSignup ? "/login" : "/signup"} className="focus-ring rounded-md border border-line bg-white px-4 py-2.5 text-sm font-extrabold text-ink transition hover:border-bridge hover:text-bridge">
              {isSignup ? "Sign in" : "Create account"}
            </Link>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100svh-76px)] lg:grid-cols-[minmax(0,1fr)_520px]">
        <div className="relative hidden overflow-hidden bg-ink text-white lg:block">
          <Image src="/landing/studentbridge-hero-bg.png" alt="" fill priority sizes="60vw" className="absolute inset-0 object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,18,31,0.76),rgba(9,18,31,0.28))]" />
          <div className="relative z-10 flex min-h-full flex-col justify-end px-10 py-12 xl:px-14">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-md border border-white/24 bg-white/12 px-3 py-2 text-sm font-extrabold text-white backdrop-blur">
                StudentBridge workspace
              </p>
              <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-normal xl:text-6xl">
                {isSignup ? "Create your first-week path." : "Welcome back to your Sydney plan."}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/84">
                {isSignup
                  ? "Set up a student profile, choose what matters this week, and land in a workspace shaped around practical next steps."
                  : "Continue into events, forum posts, job leads and support links without rebuilding your context."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-mist px-5 py-10 lg:bg-white lg:px-8">
          <FakeAuthForm mode={mode} />
        </div>
      </section>
    </main>
  );
}

function FakeAuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [selectedIdentity, setSelectedIdentity] = useState(demoIdentities[0]);
  const [form, setForm] = useState({
    name: demoIdentities[0].name,
    email: demoIdentities[0].email,
    password: "studentbridge",
    institution: demoIdentities[0].institution,
    studyArea: demoIdentities[0].studyArea,
    arrivalStage: demoIdentities[0].arrivalStage
  });

  const nextPath = isSignup ? "/onboarding?from=signup" : "/dashboard";
  const headline = isSignup ? "Create account" : "Sign in";
  const body = isSignup
    ? "Start with a student profile so the onboarding screen can shape your workspace."
    : "Choose a sample student or use any email to open the workspace.";

  const selectedSummary = useMemo(() => {
    return [form.institution, form.studyArea, form.arrivalStage].filter(Boolean).join(" • ");
  }, [form.arrivalStage, form.institution, form.studyArea]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseIdentity(identity: DemoIdentity) {
    setSelectedIdentity(identity);
    setForm({
      name: identity.name,
      email: identity.email,
      password: "studentbridge",
      institution: identity.institution,
      studyArea: identity.studyArea,
      arrivalStage: identity.arrivalStage
    });
  }

  function continueAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim() || selectedIdentity.name;
    const email = form.email.trim() || selectedIdentity.email;

    localStorage.setItem(
      "studentbridge:v1:session",
      JSON.stringify({
        id: "demo-session",
        name,
        email,
        authMode: mode,
        onboardingComplete: !isSignup,
        signedInAt: new Date().toISOString()
      })
    );

    if (isSignup) {
      localStorage.setItem(
        "studentbridge:v1:profile",
        JSON.stringify({
          id: "demo-profile",
          city: "Sydney",
          institution: form.institution,
          studyArea: form.studyArea,
          arrivalStage: form.arrivalStage,
          goals: ["Make friends", "Find work"],
          languages: ["English"],
          preferredEventTypes: ["Career", "Community"]
        })
      );
    }

    router.push(nextPath);
  }

  return (
    <section className="w-full max-w-[460px]">
      <div className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-7">
        <p className="muted-label">{isSignup ? "New student" : "Demo access"}</p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-normal">{headline}</h2>
        <p className="mt-3 text-sm leading-6 text-mutedText">{body}</p>

        <div className="mt-6 grid gap-3">
          {demoIdentities.map((identity) => {
            const active = identity.email === selectedIdentity.email;
            return (
              <button
                type="button"
                key={identity.email}
                onClick={() => chooseIdentity(identity)}
                className={`focus-ring rounded-md border p-4 text-left transition ${
                  active ? "border-bridge bg-blue-50" : "border-line bg-white hover:border-bridge hover:bg-mist"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold">{identity.name}</p>
                    <p className="mt-1 text-sm font-bold text-mutedText">{identity.email}</p>
                  </div>
                  {active ? <CheckCircle2 className="h-5 w-5 text-bridge" /> : null}
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-mutedText">{identity.studyArea}</p>
              </button>
            );
          })}
        </div>

        <form className="mt-6 grid gap-4" onSubmit={continueAuth}>
          {isSignup ? (
            <AuthField icon={UserRound} label="Full name" value={form.name} onChange={(value) => updateField("name", value)} />
          ) : null}
          <AuthField icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} />
          <AuthField icon={LockKeyhole} label="Password" type="password" value={form.password} onChange={(value) => updateField("password", value)} />

          {isSignup ? (
            <>
              <AuthField icon={GraduationCap} label="Institution" value={form.institution} onChange={(value) => updateField("institution", value)} />
              <AuthField icon={MapPin} label="Study area" value={form.studyArea} onChange={(value) => updateField("studyArea", value)} />
              <div>
                <p className="muted-label">Arrival stage</p>
                <div className="mt-2 grid gap-2">
                  {arrivalStages.map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => updateField("arrivalStage", stage)}
                      className={`focus-ring rounded-md border px-3 py-2 text-left text-sm font-bold transition ${
                        form.arrivalStage === stage ? "border-bridge bg-blue-50 text-bridge" : "border-line bg-white text-mutedText hover:border-bridge"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          <div className="rounded-md border border-line bg-mist p-3 text-sm font-bold leading-6 text-mutedText">{selectedSummary}</div>

          <Button type="submit" className="h-12 rounded-md bg-bridge px-5 text-sm font-extrabold text-white hover:bg-blue-700">
            {isSignup ? "Continue to onboarding" : "Open workspace"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm font-bold text-mutedText">
        {isSignup ? "Already have a StudentBridge profile?" : "New to StudentBridge?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="text-bridge hover:underline">
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </section>
  );
}

function AuthField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text"
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="muted-label">{label}</span>
      <div className="mt-2 flex h-12 items-center gap-3 rounded-md border border-line bg-white px-3 focus-within:border-bridge focus-within:ring-3 focus-within:ring-bridge/10">
        <Icon className="h-4 w-4 text-mutedText" />
        <Input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>
    </label>
  );
}
