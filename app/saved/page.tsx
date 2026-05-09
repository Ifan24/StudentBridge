import Link from "next/link";
import { ArrowRight, Bookmark, BriefcaseBusiness, CalendarDays, ExternalLink, MessageCircle, ShieldCheck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, Pill } from "@/components/ui";
import { getForumData, getJobs, getSavedItemIds, getSupportResources } from "@/lib/data";
import { getCityOfSydneyEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const [events, forum, jobs, support, savedEvents, savedPosts, savedJobs, savedSupport] = await Promise.all([
    getCityOfSydneyEvents(),
    getForumData(),
    getJobs(),
    getSupportResources(),
    getSavedItemIds("event"),
    getSavedItemIds("post"),
    getSavedItemIds("job"),
    getSavedItemIds("support")
  ]);

  const savedCards = [
    ...events
      .filter((event) => savedEvents.includes(event.id))
      .map((event) => ({
        id: `event-${event.id}`,
        type: "Event",
        title: event.title,
        body: `${event.dateLabel} · ${event.location}`,
        href: event.sourceUrl,
        external: true,
        icon: <CalendarDays />,
        tone: "blue" as const
      })),
    ...forum.posts
      .filter((post) => savedPosts.includes(post.id))
      .map((post) => ({
        id: `post-${post.id}`,
        type: "Forum",
        title: post.title,
        body: `${post.replyCount} replies · ${post.city}`,
        href: "/forum",
        external: false,
        icon: <MessageCircle />,
        tone: "violet" as const
      })),
    ...jobs
      .filter((job) => savedJobs.includes(job.id))
      .map((job) => ({
        id: `job-${job.id}`,
        type: "Job",
        title: job.title,
        body: `${job.company} · ${job.city}`,
        href: job.applyUrl,
        external: true,
        icon: <BriefcaseBusiness />,
        tone: "green" as const
      })),
    ...support
      .filter((resource) => savedSupport.includes(resource.id))
      .map((resource) => ({
        id: `support-${resource.id}`,
        type: "Support",
        title: resource.title,
        body: resource.description,
        href: resource.url,
        external: true,
        icon: <ShieldCheck />,
        tone: "amber" as const
      }))
  ];

  return (
    <AppShell>
      <PageHeader title="Saved" description="A quick board for the events, forum posts, jobs and support resources you want to revisit." />

      {savedCards.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {savedCards.map((item) => (
            <article key={item.id} className="panel p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-mist text-bridge [&>svg]:h-5 [&>svg]:w-5">{item.icon}</div>
                <div className="min-w-0 flex-1">
                  <Pill tone={item.tone}>{item.type}</Pill>
                  <h2 className="mt-3 text-xl font-extrabold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                </div>
              </div>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md border border-bridge px-4 py-2.5 text-sm font-extrabold text-bridge">
                  Open <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link href={item.href} className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md border border-bridge px-4 py-2.5 text-sm font-extrabold text-bridge">
                  Open <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Nothing saved yet" body="Save an event, forum thread, job or support resource and it will appear here." />
      )}

      <div className="mt-6 rounded-lg border border-line bg-mist p-5">
        <div className="flex items-center gap-3">
          <Bookmark className="h-5 w-5 text-bridge" />
          <p className="text-sm font-bold text-muted">Saved items stay connected to your profile, so refreshing the app keeps the same shortlist.</p>
        </div>
      </div>
    </AppShell>
  );
}
