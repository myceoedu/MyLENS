import dynamic from "next/dynamic";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getAdminLearningModules } from "@/lib/learning/queries";
import { AdminCard, AdminPage, AdminPageHeader } from "@/components/admin/AdminUI";
import LearningWorkspaceNav from "@/components/admin/LearningWorkspaceNav";

const LearningAdminPanel = dynamic(() => import("@/components/admin/LearningAdminPanel"), {
  loading: () => (
    <div className="h-[32rem] animate-pulse rounded-xl border border-zinc-200 bg-white" />
  ),
});

export default async function AdminLearningAssignmentsPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const [modules, taskQueueResult] = await Promise.all([
    getAdminLearningModules(),
    supabase
      .from("learning_task_submissions")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "in_review"]),
  ]);

  const assignments = modules.flatMap((module) =>
    module.items.filter((item) => item.content_type === "task")
  );
  const publishedCount = assignments.filter((item) => item.published).length;
  const pendingTasks =
    taskQueueResult.error?.code === "42P01" ? 0 : (taskQueueResult.count ?? 0);

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Academy" title="Assignments" />

      <LearningWorkspaceNav active="assignments" reviewCount={pendingTasks} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Assignments", assignments.length],
          ["Published", publishedCount],
          ["Awaiting review", pendingTasks],
        ].map(([label, value]) => (
          <AdminCard key={label} className="px-4 py-3.5">
            <p className="text-2xl font-semibold tabular-nums text-zinc-900">{value}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              {label}
            </p>
          </AdminCard>
        ))}
      </div>

      <LearningAdminPanel modules={modules} mode="assignments" />
    </AdminPage>
  );
}
