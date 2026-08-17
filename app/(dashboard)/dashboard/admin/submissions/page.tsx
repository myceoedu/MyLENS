import Link from "next/link";
import { Film } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import StatusBadge from "@/components/creator/StatusBadge";
import CategoryPill from "@/components/creator/CategoryPill";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
  AdminCard,
  AdminEmptyState,
  AdminPage,
  AdminPageHeader,
  adminButton,
  adminField,
} from "@/components/admin/AdminUI";
import {
  ADMIN_SUBMISSION_FILTERS,
  filterLabel,
  formatSubmissionDate,
  isAdminSubmissionFilter,
  statusesForFilter,
  type AdminSubmissionFilter,
  type AdminSubmissionListItem,
} from "@/lib/admin/submissions";
import { getStateLabel } from "@/lib/admin/schools";
import type { SubmissionStatus } from "@/types/auth";
import { VIDEO_CATEGORIES } from "@/types/submission";
import type { VideoCategory } from "@/lib/data/videos";
import { cn } from "@/lib/utils";

function isVideoCategory(value: string): value is VideoCategory {
  return (VIDEO_CATEGORIES as string[]).includes(value);
}

const PAGE_SIZE = 20;

type SchoolEmbed = { name: string } | { name: string }[] | null;

function schoolNameFromEmbed(schools: SchoolEmbed): string | null {
  if (!schools) return null;
  if (Array.isArray(schools)) return schools[0]?.name ?? null;
  return schools.name ?? null;
}

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { page, q: rawQuery, status: rawStatus } = await searchParams;

  const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  const query = rawQuery?.trim().slice(0, 80) ?? "";
  const searchTerm = query.replaceAll(/[,%()]/g, "");
  const filter: AdminSubmissionFilter = isAdminSubmissionFilter(rawStatus ?? "")
    ? (rawStatus as AdminSubmissionFilter)
    : "queue";

  const statusList = statusesForFilter(filter);

  let listQuery = supabase
    .from("submissions")
    .select(
      "id, user_id, school_id, title, category, location, state_id, video_url, status, created_at, updated_at, schools(name)",
      { count: "exact" }
    )
    .order("updated_at", { ascending: false });

  if (statusList) {
    listQuery = listQuery.in("status", statusList);
  }
  if (searchTerm) {
    listQuery = listQuery.ilike("title", `%${searchTerm}%`);
  }

  const [
    { data: rows, count: totalCount, error },
    { count: queueCount },
    { count: submittedCount },
    { count: approvedCount },
  ] = await Promise.all([
    listQuery.range(rangeStart, rangeStart + PAGE_SIZE - 1),
    supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "in_review"]),
    supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "submitted"),
    supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
        <p className="mb-2 font-medium text-rose-800">Could not load submissions</p>
        <p className="text-sm text-rose-600">
          Run migration <code className="font-mono text-xs">007_phase4_submissions.sql</code> in
          Supabase, then refresh. ({error.message})
        </p>
      </div>
    );
  }

  const userIds = [...new Set((rows ?? []).map((r) => r.user_id))];
  const profileMap: Record<string, { full_name: string | null; email: string }> = {};

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    for (const p of profiles ?? []) {
      profileMap[p.id] = { full_name: p.full_name, email: p.email };
    }
  }

  const items: AdminSubmissionListItem[] = (rows ?? []).map((row) => {
    const profile = profileMap[row.user_id];
    return {
      id: row.id,
      user_id: row.user_id,
      school_id: row.school_id,
      title: row.title,
      category: row.category,
      location: row.location,
      state_id: row.state_id,
      video_url: row.video_url,
      status: row.status as SubmissionStatus,
      created_at: row.created_at,
      updated_at: row.updated_at,
      school_name: schoolNameFromEmbed(row.schools as SchoolEmbed),
      creator_name: profile?.full_name ?? null,
      creator_email: profile?.email ?? null,
    };
  });

  const total = totalCount ?? 0;

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Campaign entries"
        title="Video submissions"
        description="Review creator tourism videos, request edits, and approve entries."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Needs review"
          value={queueCount ?? 0}
          hint="Submitted + in review"
          variant="pending"
        />
        <AdminStatCard
          label="Newly submitted"
          value={submittedCount ?? 0}
          hint="Not opened yet"
          variant="schools"
        />
        <AdminStatCard
          label="Approved"
          value={approvedCount ?? 0}
          hint="Approved entries"
          variant="active"
        />
      </div>

      <AdminCard>
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-4 sm:p-5">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="submission-search">
              Search submissions
            </label>
            <input
              id="submission-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search by title"
              className={`${adminField} sm:flex-1`}
            />
            <input type="hidden" name="status" value={filter} />
            <button type="submit" className={adminButton.primary}>
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5">
            {ADMIN_SUBMISSION_FILTERS.map((f) => {
              const active = filter === f;
              const href =
                f === "queue"
                  ? query
                    ? `/dashboard/admin/submissions?q=${encodeURIComponent(query)}`
                    : "/dashboard/admin/submissions"
                  : `/dashboard/admin/submissions?status=${f}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
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
                  {filterLabel(f)}
                </Link>
              );
            })}
          </div>
        </div>

        {items.length === 0 ? (
          <AdminEmptyState
            icon={<Film className="h-5 w-5" />}
            title={filter === "queue" ? "Review queue is clear" : "No submissions in this filter"}
            description={
              filter === "queue"
                ? "New creator submissions will appear here when they submit for review."
                : "Try another status filter or clear the search."
            }
          />
        ) : (
          <ul className="divide-y divide-zinc-100">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/dashboard/admin/submissions/${item.id}`}
                  className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-zinc-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={item.status} />
                      {isVideoCategory(String(item.category)) ? (
                        <CategoryPill category={item.category as VideoCategory} />
                      ) : (
                        <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-base font-semibold text-zinc-900">{item.title}</p>
                    <p className="text-sm text-zinc-500">
                      {item.creator_name ?? "Unknown creator"}
                      {item.school_name ? ` · ${item.school_name}` : ""}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {item.location} · {getStateLabel(item.state_id)} · Updated{" "}
                      {formatSubmissionDate(item.updated_at)}
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
          pathname="/dashboard/admin/submissions"
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={total}
          query={{
            q: query || undefined,
            status: filter === "queue" ? undefined : filter,
          }}
        />
      </AdminCard>
    </AdminPage>
  );
}
