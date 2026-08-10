import Link from "next/link";
import { ArrowRight, Plus, School as SchoolIcon } from "lucide-react";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { createClient } from "@/lib/supabase/server";
import { getStateLabel } from "@/lib/admin/schools";
import TokenCopyButton from "@/components/admin/TokenCopyButton";
import {
  AdminCard,
  AdminEmptyState,
  AdminPage,
  AdminPageHeader,
  StatusPill,
  adminButton,
  adminField,
  adminTable,
} from "@/components/admin/AdminUI";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import type { SchoolStatus } from "@/types/auth";

const PAGE_SIZE = 25;

const STATUS_TONE = {
  active: "emerald",
  pending: "amber",
  archived: "neutral",
} as const;

export default async function AdminSchoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const { page, q: rawQuery, status: rawStatus } = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  const query = rawQuery?.trim().slice(0, 80) ?? "";
  const status = ["active", "pending", "archived"].includes(rawStatus ?? "")
    ? (rawStatus as SchoolStatus)
    : undefined;

  let schoolsQuery = supabase
    .from("schools")
    .select("id, name, state_id, status, access_token, created_at", { count: "exact" })
    .order("name");

  if (query) schoolsQuery = schoolsQuery.ilike("name", `%${query}%`);
  if (status) schoolsQuery = schoolsQuery.eq("status", status);

  const { data: schools, count: schoolCount } = await schoolsQuery.range(
    rangeStart,
    rangeStart + PAGE_SIZE - 1
  );

  const schoolIds = (schools ?? []).map((s) => s.id);
  const creatorCounts: Record<string, number> = {};

  if (schoolIds.length > 0) {
    const { data: creators } = await supabase
      .from("profiles")
      .select("school_id")
      .eq("role", "creator")
      .in("status", ["active", "pending"])
      .in("school_id", schoolIds);

    for (const c of creators ?? []) {
      if (c.school_id) {
        creatorCounts[c.school_id] = (creatorCounts[c.school_id] ?? 0) + 1;
      }
    }
  }

  const hasFilters = Boolean(query || status);

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Campaign operations"
        title="Schools"
        description="Manage participating schools, team capacity, and secure access tokens."
        actions={
          <Link href="/dashboard/admin/schools/new" className={adminButton.primary}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add school
          </Link>
        }
      />

      <AdminCard>
        <form className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <label className="sr-only" htmlFor="school-search">
            Search schools
          </label>
          <input
            id="school-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search schools"
            className={`${adminField} sm:flex-1`}
          />
          <label className="sr-only" htmlFor="school-status">
            Filter by school status
          </label>
          <select
            id="school-status"
            name="status"
            defaultValue={status ?? ""}
            className={`${adminField} sm:w-44`}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
          <button type="submit" className={adminButton.primary}>
            Apply
          </button>
        </form>

        {(schools ?? []).length === 0 ? (
          <AdminEmptyState
            icon={<SchoolIcon className="h-5 w-5" />}
            title={hasFilters ? "No schools match these filters" : "No schools yet"}
            description={
              hasFilters
                ? "Try a different name or status."
                : "Add your first participating school to generate an access token."
            }
            action={
              hasFilters ? undefined : (
                <Link href="/dashboard/admin/schools/new" className={adminButton.primary}>
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Add school
                </Link>
              )
            }
          />
        ) : (
          <div className={adminTable.wrapper}>
            <table className={adminTable.table}>
              <thead>
                <tr className={adminTable.head}>
                  <th className={adminTable.th}>School</th>
                  <th className={adminTable.th}>State</th>
                  <th className={adminTable.th}>Creators</th>
                  <th className={adminTable.th}>Access token</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.th} />
                </tr>
              </thead>
              <tbody>
                {(schools ?? []).map((school) => (
                  <tr key={school.id} className={adminTable.row}>
                    <td className={adminTable.tdStrong}>{school.name}</td>
                    <td className={adminTable.td}>{getStateLabel(school.state_id)}</td>
                    <td className={adminTable.td}>
                      {creatorCounts[school.id] ?? 0}
                      <span className="text-zinc-400"> / {MAX_CREATORS_PER_SCHOOL}</span>
                    </td>
                    <td className={adminTable.td}>
                      {school.access_token ? (
                        <TokenCopyButton token={school.access_token} />
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className={adminTable.td}>
                      <StatusPill tone={STATUS_TONE[school.status] ?? "neutral"}>
                        {school.status}
                      </StatusPill>
                    </td>
                    <td className={`${adminTable.td} text-right`}>
                      <Link
                        href={`/dashboard/admin/schools/${school.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#0F3A2C] hover:underline"
                      >
                        Manage
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <DashboardPagination
          pathname="/dashboard/admin/schools"
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={schoolCount ?? 0}
          query={{ q: query, status }}
        />
      </AdminCard>
    </AdminPage>
  );
}
