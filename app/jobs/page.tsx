import { AppShell, PageHeader } from "@/components/app-shell";
import { JobsBoard } from "@/components/jobs-board";
import { getJobs, getSavedItemIds } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const [jobs, savedJobIds] = await Promise.all([
    getJobs(),
    getSavedItemIds("job")
  ]);

  return (
    <AppShell>
      <PageHeader title="Jobs" description="Find trusted job, internship, volunteering and industry-experience opportunities relevant to international students." />
      <JobsBoard jobs={jobs} initialSavedIds={savedJobIds} />
    </AppShell>
  );
}
