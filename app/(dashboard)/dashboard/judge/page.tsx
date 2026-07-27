import { requireRole } from "@/lib/auth/session";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export default async function JudgeDashboardPage() {
  const profile = await requireRole(["judge"]);

  return (
    <section className="rounded-[2rem] border border-[#dfd9cd] bg-white p-6 shadow-[0_18px_45px_-36px_rgba(16,39,28,0.42)] md:p-10">
      <DashboardPageHeader
        eyebrow="Judging workspace"
        title="Review dashboard"
        description={`Welcome, ${profile.full_name ?? profile.email}. The review queue and scoring tools will appear here when judging opens.`}
      />
    </section>
  );
}
