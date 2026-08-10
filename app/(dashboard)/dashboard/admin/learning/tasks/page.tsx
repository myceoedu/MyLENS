import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getAdminTaskSubmissions } from "@/lib/learning/queries";
import {
  ADMIN_TASK_FILTERS,
  formatTaskDate,
  isAdminTaskFilter,
  taskFilterLabel,
  type AdminTaskFilter,
} from "@/lib/learning/tasks";
import {
  AdminCard,
  AdminEmptyState,
  AdminPage,
  AdminPageHeader,
  StatusPill,
  adminButton,
  adminField,
} from "@/components/admin/AdminUI";
import LearningWorkspaceNav from "@/components/admin/LearningWorkspaceNav";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import { LEARNING_TASK_STATUS_LABELS } from "@/types/learning";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 20;

const STATUS_TONE = {
  draft: "neutral",
  submitted: "amber",
  in_review: "sky",
  approved: "emerald",
  revision: "brass",
  rejected: "rose",
} as const;

export default async function AdminLearningTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  await requireRole(["admin"]);
  const { page, q: rawQuery, status: rawStatus } = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const query = rawQuery?.trim().slice(0, 80) ?? "";
  const filter: AdminTaskFilter = isAdminTaskFilter(rawStatus ?? "")
    ? (rawStatus as AdminTaskFilter)
    : "queue";

  let items: Awaited<ReturnType<typeof getAdminTaskSubmissions>>["items"] = [];
  let total = 0;
  let loadError: string | null = null;
  let pendingTasks = 0;

  try {
    const [result, supabase] = await Promise.all([
      getAdminTaskSubmissions({
        filter,
        query,
        page: currentPage,
        pageSize: PAGE_SIZE,
      }),
      createClient(),
    ]);
    items = result.items;
    total = result.total;
    const queueCount = await supabase
      .from("learning_task_submissions")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "in_review"]);
    pendingTasks = queueCount.error?.code === "42P01" ? 0 : (queueCount.count ?? 0);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load tasks.";
  }

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Academy" title="Reviews" />

      <LearningWorkspaceNav active="reviews" reviewCount={pendingTasks} />

      {loadError ? (
        <AdminCard className="px-6 py-8 text-center">
          <p className="font-medium text-rose-800">Could not load task submissions</p>
          <p className="mt-2 text-sm text-rose-600">
            Run migration <code className="font-mono text-xs">014_learning_tasks.sql</code> in
            Supabase, then refresh. ({loadError})
          </p>
        </AdminCard>
      ) : (
        <AdminCard>
          <div className="flex flex-col gap-4 border-b border-zinc-100 p-4 sm:p-5">
            <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="task-search">
                Search tasks
              </label>
              <input
                id="task-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search task, creator, or school"
                className={`${adminField} sm:flex-1`}
              />
              <input type="hidden" name="status" value={filter} />
              <button type="submit" className={adminButton.primary}>
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5">
              {ADMIN_TASK_FILTERS.map((f) => {
                const active = filter === f;
                const href =
                  f === "queue"
                    ? query
                      ? `/dashboard/admin/learning/tasks?q=${encodeURIComponent(query)}`
                      : "/dashboard/admin/learning/tasks"
                    : `/dashboard/admin/learning/tasks?status=${f}${
                        query ? `&q=${encodeURIComponent(query)}` : ""
                      }`;
                return (
                  <Link
                    key={f}
                    href={href}
                    prefetch={false}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-[#0F3A2C] bg-[#0F3A2C] text-white"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                    )}
                  >
                    {taskFilterLabel(f)}
                  </Link>
                );
              })}
            </div>
          </div>

          {items.length === 0 ? (
            <AdminEmptyState
              icon={<ClipboardList className="h-5 w-5" />}
              title={filter === "queue" ? "No reviews pending" : "No results"}
              description={
                filter === "queue" ? "New submissions will appear here." : "Try another filter."
              }
            />
          ) : (
            <ul className="divide-y divide-zinc-100">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/dashboard/admin/learning/tasks/${item.id}`}
                    className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-zinc-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill tone={STATUS_TONE[item.status] ?? "neutral"}>
                          {LEARNING_TASK_STATUS_LABELS[item.status]}
                        </StatusPill>
                        {item.module_title ? (
                          <span className="text-xs text-zinc-400">{item.module_title}</span>
                        ) : null}
                      </div>
                      <p className="truncate text-base font-semibold text-zinc-900">
                        {item.task_title}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {item.creator_name ?? "Unknown creator"}
                        {item.school_name ? ` · ${item.school_name}` : ""}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Submitted {formatTaskDate(item.submitted_at)} · Attempt {item.attempt}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-[#0F3A2C] group-hover:underline">
                      Review →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <DashboardPagination
            pathname="/dashboard/admin/learning/tasks"
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalItems={total}
            query={{
              q: query || undefined,
              status: filter === "queue" ? undefined : filter,
            }}
          />
        </AdminCard>
      )}
    </AdminPage>
  );
}
