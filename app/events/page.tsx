import { AppShell, PageHeader } from "@/components/app-shell";
import { EventsBoard } from "@/components/events-board";
import { getSavedItemIds } from "@/lib/data";
import { getCityOfSydneyEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [events, savedEventIds] = await Promise.all([
    getCityOfSydneyEvents(),
    getSavedItemIds("event")
  ]);

  return (
    <AppShell>
      <PageHeader title="Events" description="Discover trusted social, academic, career and community events from City of Sydney What’s On." />
      <EventsBoard events={events} initialSavedIds={savedEventIds} />
    </AppShell>
  );
}
