import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  MessageCircle,
  Search,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { getForumData, getJobs, getSupportResources } from "@/lib/data";
import { getCityOfSydneyEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Forum", href: "/forum" },
  { label: "Jobs", href: "/jobs" },
  { label: "Support", href: "/support" },
  { label: "AI Guide", href: "/ai" }
];

const pathways = [
  {
    title: "Find your next place to go",
    body: "Browse student-friendly Sydney events, then save the ones that fit your week.",
    href: "/events",
    icon: CalendarDays
  },
  {
    title: "Ask before you guess",
    body: "Use the forum for study, housing, work and confidence questions from other students.",
    href: "/forum",
    icon: MessageCircle
  },
  {
    title: "Turn interest into action",
    body: "Shortlist jobs, track applications, and keep useful support links close.",
    href: "/jobs",
    icon: BriefcaseBusiness
  }
];

export default async function LandingPage() {
  const [events, forum, jobs, support] = await Promise.all([
    getCityOfSydneyEvents(),
    getForumData(),
    getJobs(),
    getSupportResources()
  ]);

  const stats = [
    { label: "Sydney events", value: formatCount(events.length), icon: CalendarDays, href: "/events" },
    { label: "Forum threads", value: formatCount(forum.posts.length), icon: MessageCircle, href: "/forum" },
    { label: "Job leads", value: formatCount(jobs.length), icon: BriefcaseBusiness, href: "/jobs" },
    { label: "Support links", value: formatCount(support.length), icon: ShieldCheck, href: "/support" }
  ];

  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1360px] items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-md">
            <Image
              src="/brand/studentbridge-mark-app.png"
              alt=""
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-md object-cover shadow-soft"
            />
            <span className="truncate text-xl font-extrabold tracking-normal">StudentBridge</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold text-mutedText lg:flex">
            {navLinks.map((item) => (
              <Link key={item.href} className="transition hover:text-ink" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search StudentBridge"
              className="focus-ring hidden h-10 w-10 place-items-center rounded-md border border-line bg-white text-mutedText transition hover:border-bridge hover:text-bridge md:grid"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/login"
              className="focus-ring hidden min-h-10 items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-extrabold text-ink transition hover:border-bridge hover:text-bridge sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="focus-ring inline-flex min-h-10 items-center justify-center rounded-md bg-bridge px-4 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <section className="relative isolate min-h-[620px] overflow-hidden bg-ink text-white lg:min-h-[660px]">
        <Image
          src="/landing/studentbridge-hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,18,31,0.74)_0%,rgba(9,18,31,0.58)_31%,rgba(9,18,31,0.18)_66%,rgba(9,18,31,0.06)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-[linear-gradient(0deg,rgba(9,18,31,0.58),rgba(9,18,31,0))]" />

        <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
          <div className="max-w-[720px] py-20 lg:py-28">
            <p className="inline-flex rounded-md border border-white/24 bg-white/12 px-3 py-2 text-sm font-extrabold text-white backdrop-blur">
              International student workspace
            </p>
            <h1 className="mt-7 max-w-[720px] text-6xl font-extrabold leading-[0.94] tracking-normal text-white md:text-7xl lg:text-8xl xl:text-[6.5rem]">
              StudentBridge
            </h1>
            <p className="mt-5 text-2xl font-extrabold tracking-normal text-white md:text-3xl">Connect. Share. Belong.</p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/86 md:text-lg">
              Discover Sydney events, ask student-life questions, shortlist jobs, find official support, and keep your next steps together.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-blue-700"
              >
                Create account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/events"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/54 bg-white/12 px-5 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore events <CalendarDays className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      <StatsStrip items={stats} />

      <section className="mx-auto grid max-w-[1360px] gap-8 px-5 pb-16 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="muted-label">Built around real student moments</p>
          <h2 className="mt-3 max-w-xl text-4xl font-extrabold leading-tight tracking-normal md:text-5xl">
            Start with one next step, then keep moving.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-mutedText">
            Every section points to a practical action: a place to go, a question to ask, a job to consider, or a trusted support path.
          </p>
          <Link
            href="/signup"
            className="focus-ring mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-extrabold text-white transition hover:bg-bridge"
          >
            Start onboarding <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pathways.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="focus-ring rounded-lg border border-line bg-white p-5 transition hover:border-bridge hover:bg-mist">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-mist text-bridge">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-mutedText">{item.body}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-5 pb-12 lg:px-8">
        <div className="grid gap-5 rounded-lg border border-line bg-mist p-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white text-violet">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold">AI Guide and support routing live inside the workspace.</p>
              <p className="mt-2 text-sm leading-6 text-mutedText">
                Move from discovery to action across events, student questions, jobs, and trusted support.
              </p>
            </div>
          </div>
          <Link
            href="/signup"
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
          >
            Create account <ShieldCheck className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

type StatItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  href: string;
};

function StatsStrip({ items }: { items: StatItem[] }) {
  return (
    <section className="relative z-20 mx-auto -mt-8 max-w-[1180px] px-5 lg:px-8">
      <div className="grid overflow-hidden rounded-lg border border-line bg-white shadow-[0_22px_80px_rgba(16,32,51,0.13)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`focus-ring flex min-h-24 items-center gap-3 px-4 py-4 transition hover:bg-mist ${
                index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""
              } ${index % 2 === 0 ? "sm:border-l-0 lg:border-l" : ""} ${index === 0 ? "lg:border-l-0" : ""}`}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-blue-50 text-bridge">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-2xl font-extrabold leading-none">{item.value}</p>
                <p className="mt-1 truncate text-xs font-extrabold uppercase tracking-[0.08em] text-mutedText">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-AU").format(value);
}
