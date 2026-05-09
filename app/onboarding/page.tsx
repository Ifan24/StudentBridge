import { AppShell, PageHeader } from "@/components/app-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { getStudentProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const profile = await getStudentProfile();

  return (
    <AppShell>
      <PageHeader title="Onboarding" description="Tell StudentBridge enough about your city, study area, goals and languages to create practical recommendations." />
      <OnboardingForm profile={profile} />
    </AppShell>
  );
}
