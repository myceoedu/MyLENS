import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Film,
  MessageSquare,
  Plus,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import AdminAttentionPanel from "@/components/admin/AdminAttentionPanel";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
  AdminCard,
  AdminPage,
  AdminPageHeader,
  AdminSection,
  adminButton,
} from "@/components/admin/AdminUI";

const SHORTCUTS = [
  {
    href: "/dashboard/admin/submissions",
    label: "Review submissions",
    description: "Approve, request edits, or reject entries",
    icon: Film,
  },
  {
    href: "/dashboard/admin/learning/tasks",
    label: "Review assignments",
    description: "Pending learning submissions",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/admin/users/pending",
    label: "Approve creators",
    description: "Activate accounts waiting on verification",
    icon: UserCheck,
  },
  {
    href: "/dashboard/admin/inquiries",
    label: "Answer inquiries",
    description: "School and partnership messages",
    icon: MessageSquare,
  },
];

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
    { count: pendingSubmissionCount },
    taskQueueResult,
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
    supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "in_review"]),
    supabase
      .from("learning_task_submissions")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "in_review"]),
  ]);

  const pending = pendingCount ?? 0;
  const newInquiries = (newSchoolInquiryCount ?? 0) + (newPartnershipInquiryCount ?? 0);
  const pendingSubmissions = pendingSubmissionCount ?? 0;
  const pendingLearningTasks =
    taskQueueResult.error?.code === "42P01" ? 0 : (taskQueueResult.count ?? 0);

  return (
    <AdminPage className="space-y-8">
      <AdminPageHeader
        eyebrow="Operations overview"
        title="National campaign workspace"
        description="Everything waiting on you, in one place — video submissions, learning tasks, approvals, and inquiries."
        actions={
          <>
            <Link href="/dashboard/admin/submissions" className={adminButton.secondary}>
              Review queue
              {pendingSubmissions + pendingLearningTasks > 0 && (
                <span className="rounded-full bg-amber-100 px-1.5 text-[11px] font-semibold tabular-nums text-amber-700">
                  {pendingSubmissions + pendingLearningTasks}
                </span>
              )}
            </Link>
            <Link href="/dashboard/admin/schools/new" className={adminButton.primary}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add school
            </Link>
          </>
        }
      />

      <AdminAttentionPanel
        pendingCreators={pending}
        newInquiries={newInquiries}
        pendingSubmissions={pendingSubmissions}
        pendingLearningTasks={pendingLearningTasks}
      />

      <AdminSection title="Campaign at a glance">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            label="Schools"
            value={schoolCount ?? 0}
            hint="All registered schools"
            href="/dashboard/admin/schools"
            variant="schools"
          />
          <AdminStatCard
            label="Active schools"
            value={activeSchoolCount ?? 0}
            hint="Cleared to compete"
            href="/dashboard/admin/schools?status=active"
            variant="active"
          />
          <AdminStatCard
            label="Pending approvals"
            value={pending}
            hint="Creators awaiting activation"
            href="/dashboard/admin/users/pending"
            variant="pending"
          />
          <AdminStatCard
            label="Active creators"
            value={creatorCount ?? 0}
            hint="Verified and competing"
            href="/dashboard/admin/users?role=creator&status=active"
            variant="creators"
          />
        </div>
      </AdminSection>

      <AdminSection title="Shortcuts">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SHORTCUTS.map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href} className="group">
              <AdminCard className="h-full p-5 transition-colors group-hover:border-zinc-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-[#eef5f1] group-hover:text-[#0F3A2C]">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                  {label}
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
              </AdminCard>
            </Link>
          ))}
        </div>
      </AdminSection>
    </AdminPage>
  );
}
