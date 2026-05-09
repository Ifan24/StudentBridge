import { AppShell, PageHeader } from "@/components/app-shell";
import { SupportDirectory } from "@/components/support-directory";
import { getSupportResources } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const resources = await getSupportResources();

  return (
    <AppShell>
      <PageHeader title="Support" description="Find official support categories for work rights, wellbeing, safety, accommodation and study help." />
      <SupportDirectory resources={resources} />
    </AppShell>
  );
}
