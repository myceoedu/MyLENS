import { requireRole } from "@/lib/auth/session";

export default async function JudgeDashboardPage() {
  const profile = await requireRole(["judge"]);

  return (
    <section className="bg-white border border-zinc-200/80 rounded-3xl p-8 md:p-10 shadow-sm">
      <h1
        className="text-2xl font-bold text-emerald-950 mb-2"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Judge Dashboard
      </h1>
      <p className="text-zinc-600" style={{ fontFamily: "var(--font-inter)" }}>
        Welcome, {profile.full_name ?? profile.email}. Review queue and scoring arrive in Phase 5.
      </p>
    </section>
  );
}
