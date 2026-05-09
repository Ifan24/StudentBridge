import { AppShell, PageHeader } from "@/components/app-shell";
import { AiGuide } from "@/components/ai-guide";

export default function AiPage() {
  return (
    <AppShell>
      <PageHeader title="AI Guide" description="Get help with onboarding plans, event ideas, job-fit explanations, forum summaries and networking confidence." />
      <AiGuide />
    </AppShell>
  );
}
