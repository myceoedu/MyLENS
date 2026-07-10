import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import AdminStatCard from "@/components/admin/AdminStatCard";

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
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
      <div
        className="absolute inset-0 bg-[url('/images/batik.jpg')] bg-cover bg-center opacity-[0.012] pointer-events-none filter grayscale"
        aria-hidden="true"
      />

      <div className="relative space-y-8 p-8 md:p-10">
        <section>
          <p
            className="text-zinc-400 text-[11px] font-semibold tracking-wider uppercase mb-1 block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Command Center
          </p>
          <h1
            className="text-2xl font-bold text-emerald-950 mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            National Admin Overview
          </h1>
          <p className="text-zinc-600 text-sm max-w-2xl" style={{ fontFamily: "var(--font-inter)" }}>
            Manage schools, access tokens, and creator approvals across the MyLENS 2026 campaign.
          </p>
        </section>

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

        <section className="border-t border-zinc-200/80 pt-8">
          <h2
            className="text-zinc-400 text-[11px] font-semibold tracking-wider uppercase mb-4 block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Quick actions
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/admin/schools/new"
              className="bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add School
            </Link>
            <Link
              href="/dashboard/admin/users/pending"
              className="bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Review Pending ({pending})
            </Link>
            <Link
              href="/dashboard/admin/inquiries"
              className="bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Inquiries{newInquiries > 0 ? ` (${newInquiries} new)` : ""}
            </Link>
            <Link
              href="/dashboard/admin/schools"
              className="bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
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
