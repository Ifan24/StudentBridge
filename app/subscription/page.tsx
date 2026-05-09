import { AppShell, PageHeader } from "@/components/app-shell";
import { SubscriptionPlans } from "@/components/subscription-plans";
import { getSubscriptionState } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const state = await getSubscriptionState();

  return (
    <AppShell>
      <PageHeader
        title="Premium"
        description="Choose how much AI coaching, job-search help and weekly planning support you want each month."
      />
      <SubscriptionPlans state={state} />
    </AppShell>
  );
}
