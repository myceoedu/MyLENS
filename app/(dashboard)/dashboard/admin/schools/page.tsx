import Link from "next/link";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { createClient } from "@/lib/supabase/server";
import { getStateLabel } from "@/lib/admin/schools";
import TokenCopyButton from "@/components/admin/TokenCopyButton";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import type { SchoolStatus } from "@/types/auth";

const PAGE_SIZE = 25;

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

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow="Campaign operations"
        title="Participating schools"
        description="Manage participating schools, capacity, and secure event access tokens."
        action={
          <Link
            href="/dashboard/admin/schools/new"
            className="rounded-xl bg-[#10271c] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
          >
            Add school
          </Link>
        }
      />

      <div className="overflow-hidden rounded-[1.5rem] border border-[#e2ded5] bg-white shadow-[0_16px_34px_-28px_rgba(16,39,28,0.4)]">
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
            className="min-w-0 flex-1 border border-[#ded8ca] bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#8d6928]"
          />
          <label className="sr-only" htmlFor="school-status">
            Filter by school status
          </label>
          <select
            id="school-status"
            name="status"
            defaultValue={status ?? ""}
            className="border border-[#ded8ca] bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-[#8d6928]"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
          <button
            type="submit"
            className="bg-[#10271c] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1b3d2b]"
          >
            Apply
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: "var(--font-inter)" }}>
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left">
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  School
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  State
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  Creators
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  Token
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {(schools ?? []).map((school) => (
                <tr key={school.id} className="border-b border-zinc-50 hover:bg-zinc-50/30">
                  <td className="px-6 py-4 font-medium text-zinc-900">{school.name}</td>
                  <td className="px-6 py-4 text-zinc-600">{getStateLabel(school.state_id)}</td>
                  <td className="px-6 py-4 text-zinc-600">
                    {creatorCounts[school.id] ?? 0}
                    <span className="text-zinc-400"> / {MAX_CREATORS_PER_SCHOOL}</span>
                  </td>
                  <td className="px-6 py-4">
                    {school.access_token ? (
                      <TokenCopyButton token={school.access_token} />
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        school.status === "active"
                          ? "text-emerald-700 font-medium"
                          : "text-zinc-500"
                      }
                    >
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/admin/schools/${school.id}`}
                      className="text-emerald-800 hover:text-emerald-950 font-medium"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
              {(schools ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    {query || status ? (
                      "No schools match the current filters."
                    ) : (
                      <>
                        No schools yet.{" "}
                        <Link href="/dashboard/admin/schools/new" className="text-emerald-700 underline">
                          Add your first school
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <DashboardPagination
          pathname="/dashboard/admin/schools"
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={schoolCount ?? 0}
          query={{ q: query, status }}
        />
      </div>
    </div>
  );
}
