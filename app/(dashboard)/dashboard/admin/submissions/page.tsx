import Link from "next/link";
import { Film } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import StatusBadge from "@/components/creator/StatusBadge";
import CategoryPill from "@/components/creator/CategoryPill";
import { DashboardEmptyState, DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
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
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="mb-2 font-medium text-red-800">Could not load submissions</p>
        <p className="text-sm text-red-600">
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
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow="Campaign entries"
        title="Video submissions"
        description="Review creator tourism videos, request edits, and approve entries for judging."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          label="Needs review"
          value={queueCount ?? 0}
          hint="Submitted + in review"
          variant="pending"
        />
        <AdminStatCard label="Newly submitted" value={submittedCount ?? 0} />
        <AdminStatCard label="Approved" value={approvedCount ?? 0} hint="In judging queue" />
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#e2ded5] bg-white shadow-[0_16px_34px_-28px_rgba(16,39,28,0.4)]">
        <form className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <label className="sr-only" htmlFor="submission-search">
            Search submissions
          </label>
          <input
            id="submission-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search by title"
            className="min-w-0 flex-1 rounded-xl border border-[#ddd8ce] bg-[#fbfbf8] px-3 py-2.5 text-sm outline-none focus:border-[#bba978] focus:bg-white"
          />
          <input type="hidden" name="status" value={filter} />
          <button
            type="submit"
            className="rounded-xl bg-[#10271c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1b3d2b]"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 border-b border-zinc-100 px-4 py-3 sm:px-5">
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
                  "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-[#10271c] bg-[#10271c] text-white"
                    : "border-[#e2ded5] bg-white text-zinc-600 hover:border-[#c8b077] hover:text-[#10271c]"
                )}
              >
                {filterLabel(f)}
              </Link>
            );
          })}
        </div>

        {items.length === 0 ? (
          <div className="p-6">
            <DashboardEmptyState
              icon={<Film className="h-5 w-5" />}
              title={filter === "queue" ? "Review queue is clear" : "No submissions in this filter"}
              description={
                filter === "queue"
                  ? "New creator submissions will appear here when they submit for review."
                  : "Try another status filter or clear the search."
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/dashboard/admin/submissions/${item.id}`}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#fbfbf8] sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0 space-y-2">
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
                    <p className="truncate font-serif text-lg font-semibold text-[#10271c]">
                      {item.title}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {item.creator_name ?? "Unknown creator"}
                      {item.creator_email ? ` · ${item.creator_email}` : ""}
                      {item.school_name ? ` · ${item.school_name}` : ""}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {item.location} · {getStateLabel(item.state_id)} · Updated{" "}
                      {formatSubmissionDate(item.updated_at)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-[#10271c]">Review →</span>
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
      </div>
    </div>
  );
}
