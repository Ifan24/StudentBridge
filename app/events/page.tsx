import { AppShell, PageHeader } from "@/components/app-shell";
import { EventsBoard } from "@/components/events-board";
import { getCityOfSydneyEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getCityOfSydneyEvents();

  return (
    <AppShell>
      <PageHeader title="Events" description="Discover trusted social, academic, career and community events from City of Sydney What’s On." />
      <EventsBoard events={events} />
    </AppShell>
  );
}
