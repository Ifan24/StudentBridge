import { AppShell, PageHeader } from "@/components/app-shell";
import { SupportDirectory } from "@/components/support-directory";
import { getSavedItemIds, getSupportResources } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const [resources, savedSupportIds] = await Promise.all([
    getSupportResources(),
    getSavedItemIds("support")
  ]);

  return (
    <AppShell>
      <PageHeader title="Support" description="Find official support categories for work rights, wellbeing, safety, accommodation and study help." />
      <SupportDirectory resources={resources} initialSavedIds={savedSupportIds} />
    </AppShell>
  );
}
