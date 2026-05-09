import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarDays, MessageCircle, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Pill, VerifiedLabel } from "@/components/ui";
import { getForumData, getJobs, getStudentProfile, getSupportResources } from "@/lib/data";
import { getCityOfSydneyEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [profile, events, forum, jobs, support] = await Promise.all([
    getStudentProfile(),
    getCityOfSydneyEvents(),
    getForumData(),
    getJobs(),
    getSupportResources()
  ]);

  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${profile.institution} student`}
        description={`Your StudentBridge workspace for ${profile.city}: events, forum threads, job opportunities, support resources and AI next steps.`}
        action={<Link className="focus-ring rounded-md bg-bridge px-5 py-3 text-sm font-extrabold text-white" href="/onboarding">Update profile</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="panel p-5 lg:p-7">
          <p className="muted-label">First-week plan</p>
          <h2 className="mt-2 text-2xl font-extrabold">Recommended next actions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ActionCard icon={<CalendarDays />} title="Save one event" body={events[0]?.title ?? "Find a student-friendly event this week."} href="/events" />
            <ActionCard icon={<MessageCircle />} title="Join the forum" body={forum.posts[0]?.title ?? "Ask a practical student-life question."} href="/forum" />
            <ActionCard icon={<BriefcaseBusiness />} title="Shortlist a job" body={jobs[0]?.title ?? "Review work-rights-friendly opportunities."} href="/jobs" />
            <ActionCard icon={<ShieldCheck />} title="Check support" body={support[0]?.title ?? "Open official student support links."} href="/support" />
          </div>
        </section>

        <aside className="panel p-5 lg:p-7">
          <p className="muted-label">Profile snapshot</p>
          <h2 className="mt-2 text-2xl font-extrabold">{profile.city} · {profile.studyArea}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.goals.map((goal) => <Pill key={goal}>{goal}</Pill>)}
          </div>
          <div className="mt-6 rounded-md bg-mist p-4">
            <VerifiedLabel label="Profile controls" />
            <p className="mt-3 text-sm leading-6 text-muted">Keep personal details private and choose when you are ready to share interest in events, jobs or student discussions.</p>
          </div>
        </aside>
      </div>
    </AppShell>
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
