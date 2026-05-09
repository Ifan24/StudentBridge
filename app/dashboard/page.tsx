import Link from "next/link";
import { ArrowRight, Bookmark, Bot, BriefcaseBusiness, CalendarDays, MessageCircle, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Pill, VerifiedLabel } from "@/components/ui";
import { getForumData, getJobs, getSavedItemSummary, getStudentProfile, getSubscriptionState, getSupportResources } from "@/lib/data";
import { getCityOfSydneyEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [profile, events, forum, jobs, support, savedSummary, subscription] = await Promise.all([
    getStudentProfile(),
    getCityOfSydneyEvents(),
    getForumData(),
    getJobs(),
    getSupportResources(),
    getSavedItemSummary(),
    getSubscriptionState()
  ]);
  const activePlan = subscription.plans.find((plan) => plan.slug === subscription.activePlanSlug) ?? subscription.plans[0];
  const usagePercent = activePlan ? Math.min(100, Math.round((subscription.aiUsedThisMonth / activePlan.aiMonthlyLimit) * 100)) : 0;

  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${profile.institution} student`}
        description={`Your StudentBridge workspace for ${profile.city}: events, forum threads, job opportunities, support resources and AI next steps.`}
        action={<Link className="focus-ring rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white" href="/onboarding">Update profile</Link>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<CalendarDays />} label="Events" value={events.length} detail="City listings ready to browse" href="/events" />
        <MetricCard icon={<MessageCircle />} label="Forum threads" value={forum.posts.length} detail="Student questions and replies" href="/forum" />
        <MetricCard icon={<BriefcaseBusiness />} label="Job leads" value={jobs.length} detail="Student-friendly roles to compare" href="/jobs" />
        <MetricCard icon={<Bookmark />} label="Saved items" value={savedSummary.total} detail="Events, posts, jobs and support" href="/saved" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="panel p-5 xl:p-7">
          <p className="muted-label">First-week plan</p>
          <h2 className="mt-2 text-2xl font-extrabold">Recommended next actions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ActionCard icon={<CalendarDays />} title="Save one event" body={events[0]?.title ?? "Find a student-friendly event this week."} href="/events" />
            <ActionCard icon={<MessageCircle />} title="Join the forum" body={forum.posts[0]?.title ?? "Ask a practical student-life question."} href="/forum" />
            <ActionCard icon={<BriefcaseBusiness />} title="Shortlist a job" body={jobs[0]?.title ?? "Review work-rights-friendly opportunities."} href="/jobs" />
            <ActionCard icon={<ShieldCheck />} title="Check support" body={support[0]?.title ?? "Open official student support links."} href="/support" />
          </div>
        </section>

        <aside className="panel p-5 xl:p-7">
          <p className="muted-label">Profile snapshot</p>
          <h2 className="mt-2 text-2xl font-extrabold">{profile.city} · {profile.studyArea}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.goals.map((goal) => <Pill key={goal}>{goal}</Pill>)}
          </div>
          <div className="mt-6 rounded-md bg-mist p-4">
            <VerifiedLabel label="Profile controls" />
            <p className="mt-3 text-sm leading-6 text-muted">Keep personal details private and choose when you are ready to share interest in events, jobs or student discussions.</p>
          </div>

          <div className="mt-5 rounded-md border border-line p-4">
            <p className="muted-label">Saved activity</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <SavedCount label="Events" value={savedSummary.counts.event} />
              <SavedCount label="Forum" value={savedSummary.counts.post} />
              <SavedCount label="Jobs" value={savedSummary.counts.job} />
              <SavedCount label="Support" value={savedSummary.counts.support} />
            </div>
          </div>

          <div className="mt-5 rounded-md border border-line p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-violet" />
              <p className="muted-label">AI usage</p>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-2xl font-extrabold">{subscription.aiUsedThisMonth}</p>
              <p className="text-sm font-bold text-muted">{activePlan?.aiMonthlyLimit ?? 0} included</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist">
              <div className="h-full rounded-full bg-violet" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function MetricCard({ icon, label, value, detail, href }: { icon: React.ReactNode; label: string; value: number; detail: string; href: string }) {
  return (
    <Link href={href} className="focus-ring rounded-lg border border-line bg-white p-5 transition hover:border-bridge hover:bg-mist">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-bridge [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
        <ArrowRight className="h-4 w-4 text-muted" />
      </div>
      <p className="mt-5 text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm font-extrabold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </Link>
  );
}

function SavedCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-mist p-3">
      <p className="font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-bold text-muted">{label}</p>
    </div>
  );
}

function ActionCard({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href: string }) {
  return (
    <Link href={href} className="focus-ring rounded-md border border-line bg-white p-5 transition hover:border-bridge hover:bg-mist">
      <div className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-bridge [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{body}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-bridge">Open <ArrowRight className="h-4 w-4" /></span>
    </Link>
  );
}
