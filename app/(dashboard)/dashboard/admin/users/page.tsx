import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserStatusActions from "@/components/admin/UserStatusActions";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import type { UserRole, UserStatus } from "@/types/auth";

const PAGE_SIZE = 25;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; role?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const { page, q: rawQuery, role: rawRole, status: rawStatus } = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  const query = rawQuery?.trim().slice(0, 80) ?? "";
  const searchTerm = query.replaceAll(/[,%()]/g, "");
  const role = ["creator", "admin", "judge"].includes(rawRole ?? "")
    ? (rawRole as UserRole)
    : undefined;
  const status = ["pending", "active", "suspended"].includes(rawStatus ?? "")
    ? (rawStatus as UserStatus)
    : undefined;

  let usersQuery = supabase
    .from("profiles")
    .select("id, full_name, email, role, status, school_id, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (searchTerm) {
    usersQuery = usersQuery.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
  }
  if (role) usersQuery = usersQuery.eq("role", role);
  if (status) usersQuery = usersQuery.eq("status", status);

  const { data: users, count: userCount } = await usersQuery.range(
    rangeStart,
    rangeStart + PAGE_SIZE - 1
  );

  const schoolIds = [...new Set((users ?? []).map((u) => u.school_id).filter(Boolean))] as string[];
  const schoolNames: Record<string, string> = {};

  if (schoolIds.length > 0) {
    const { data: schools } = await supabase.from("schools").select("id, name").in("id", schoolIds);
    for (const s of schools ?? []) {
      schoolNames[s.id] = s.name;
    }
  }

  return (
    <div className="space-y-7">
      <DashboardPageHeader
        eyebrow="Account operations"
        title="Users and access"
        description="Review all creator, judge, and administrator accounts across the MyLENS workspace."
        action={
          <Link
            href="/dashboard/admin/users/pending"
            className="rounded-xl border border-[#d8d2c5] bg-white px-5 py-3 text-sm font-medium text-[#10271c] transition-colors hover:border-[#bba978]"
          >
            Pending approvals
          </Link>
        }
      />

      <div className="overflow-hidden rounded-[1.5rem] border border-[#e2ded5] bg-white shadow-[0_16px_34px_-28px_rgba(16,39,28,0.4)]">
        <form className="grid gap-3 border-b border-zinc-100 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_10rem_10rem_auto] sm:p-5">
          <label className="sr-only" htmlFor="user-search">
            Search users
          </label>
          <input
            id="user-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search name or email"
            className="min-w-0 border border-[#ded8ca] bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#8d6928]"
          />
          <label className="sr-only" htmlFor="user-role">
            Filter by role
          </label>
          <select
            id="user-role"
            name="role"
            defaultValue={role ?? ""}
            className="border border-[#ded8ca] bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-[#8d6928]"
          >
            <option value="">All roles</option>
            <option value="creator">Creators</option>
            <option value="admin">Administrators</option>
            <option value="judge">Judges</option>
          </select>
          <label className="sr-only" htmlFor="user-status">
            Filter by status
          </label>
          <select
            id="user-status"
            name="status"
            defaultValue={status ?? ""}
            className="border border-[#ded8ca] bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-[#8d6928]"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
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
                  Name
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  Role
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  School
                </th>
                <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => (
                <tr key={user.id} className="border-b border-zinc-50 hover:bg-zinc-50/30">
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {user.full_name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{user.email}</td>
                  <td className="px-6 py-4 text-zinc-600 capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-zinc-600">
                    {user.school_id ? (schoolNames[user.school_id] ?? "—") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        user.status === "active"
                          ? "text-emerald-700 font-medium"
                          : user.status === "pending"
                            ? "text-amber-600 font-medium"
                            : "text-zinc-500"
                      }
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === "creator" && (
                      <UserStatusActions
                        profileId={user.id}
                        status={user.status}
                        showApprove
                      />
                    )}
                  </td>
                </tr>
              ))}
              {(users ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No users match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <DashboardPagination
          pathname="/dashboard/admin/users"
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={userCount ?? 0}
          query={{ q: query, role, status }}
        />
      </div>
    </div>
  );
}
