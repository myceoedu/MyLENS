import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import AdminAttentionPanel from "@/components/admin/AdminAttentionPanel";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const [
    { count: schoolCount },
    { count: activeSchoolCount },
    { count: pendingCount },
    { count: creatorCount },
    { count: newSchoolInquiryCount },
    { count: newPartnershipInquiryCount },
  ] = await Promise.all([
    supabase.from("schools").select("id", { count: "exact", head: true }),
    supabase.from("schools").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "creator")
      .eq("status", "active"),
    supabase
      .from("contact_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("partnership_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const pending = pendingCount ?? 0;
  const newInquiries = (newSchoolInquiryCount ?? 0) + (newPartnershipInquiryCount ?? 0);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#dfd9cd] bg-[#fbfbf8] shadow-[0_20px_55px_-42px_rgba(16,39,28,0.45)]">
      <div className="relative space-y-8 p-6 sm:p-8 md:p-10">
        <DashboardPageHeader
          eyebrow="Operations overview"
          title="National campaign workspace"
          description="Monitor participating schools, creator access, inquiries, and academy operations from one place."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard label="Schools" value={schoolCount ?? 0} hint="All registered schools" />
          <AdminStatCard label="Active Schools" value={activeSchoolCount ?? 0} />
          <AdminStatCard
            label="Pending Approvals"
            value={pending}
            hint="Creators awaiting activation"
            variant="pending"
          />
          <AdminStatCard label="Active Creators" value={creatorCount ?? 0} />
        </div>

        <AdminAttentionPanel pendingCreators={pending} newInquiries={newInquiries} />

        <section className="border-t border-[#dfd9cd] pt-8">
          <h2
            className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a722a]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Quick actions
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/admin/schools/new"
              className="flex items-center gap-2 rounded-xl bg-[#10271c] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add School
            </Link>
            <Link
              href="/dashboard/admin/users/pending"
              className="rounded-xl border border-[#ddd8ce] bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-[#bba978] hover:text-[#10271c]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Review Pending ({pending})
            </Link>
            <Link
              href="/dashboard/admin/inquiries"
              className="rounded-xl border border-[#ddd8ce] bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-[#bba978] hover:text-[#10271c]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Inquiries{newInquiries > 0 ? ` (${newInquiries} new)` : ""}
            </Link>
            <Link
              href="/dashboard/admin/schools"
              className="rounded-xl border border-[#ddd8ce] bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-[#bba978] hover:text-[#10271c]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View Schools
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
