import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import UserStatusActions from "@/components/admin/UserStatusActions";
import AdminSubTabs from "@/components/admin/AdminSubTabs";
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
import type { UserRole, UserStatus } from "@/types/auth";

const PAGE_SIZE = 25;

const STATUS_TONE = {
  active: "emerald",
  pending: "amber",
  suspended: "rose",
} as const;

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

  const [{ data: users, count: userCount }, { count: pendingCount }] = await Promise.all([
    usersQuery.range(rangeStart, rangeStart + PAGE_SIZE - 1),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const schoolIds = [...new Set((users ?? []).map((u) => u.school_id).filter(Boolean))] as string[];
  const schoolNames: Record<string, string> = {};

  if (schoolIds.length > 0) {
    const { data: schools } = await supabase.from("schools").select("id, name").in("id", schoolIds);
    for (const s of schools ?? []) {
      schoolNames[s.id] = s.name;
    }
  }

  const hasFilters = Boolean(query || role || status);

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Account operations"
        title="People"
        description="Creator, judge, and administrator accounts across the MyLENS workspace."
      />

      <AdminSubTabs
        tabs={[
          { href: "/dashboard/admin/users", label: "All accounts", active: true },
          {
            href: "/dashboard/admin/users/pending",
            label: "Pending approval",
            count: pendingCount ?? 0,
            active: false,
          },
        ]}
      />

      <AdminCard>
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
            className={adminField}
          />
          <label className="sr-only" htmlFor="user-role">
            Filter by role
          </label>
          <select id="user-role" name="role" defaultValue={role ?? ""} className={adminField}>
            <option value="">All roles</option>
            <option value="creator">Creators</option>
            <option value="admin">Administrators</option>
            <option value="judge">Judges</option>
          </select>
          <label className="sr-only" htmlFor="user-status">
            Filter by status
          </label>
          <select id="user-status" name="status" defaultValue={status ?? ""} className={adminField}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button type="submit" className={adminButton.primary}>
            Apply
          </button>
        </form>

        {(users ?? []).length === 0 ? (
          <AdminEmptyState
            icon={<Users className="h-5 w-5" />}
            title={hasFilters ? "No accounts match these filters" : "No accounts yet"}
            description={
              hasFilters
                ? "Try a different name, role, or status."
                : "Accounts appear here once creators register with a school token."
            }
          />
        ) : (
          <div className={adminTable.wrapper}>
            <table className={adminTable.table}>
              <thead>
                <tr className={adminTable.head}>
                  <th className={adminTable.th}>Name</th>
                  <th className={adminTable.th}>Email</th>
                  <th className={adminTable.th}>Role</th>
                  <th className={adminTable.th}>School</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={adminTable.th} />
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map((user) => (
                  <tr key={user.id} className={adminTable.row}>
                    <td className={adminTable.tdStrong}>{user.full_name ?? "—"}</td>
                    <td className={adminTable.td}>{user.email}</td>
                    <td className={`${adminTable.td} capitalize`}>{user.role}</td>
                    <td className={adminTable.td}>
                      {user.school_id ? (schoolNames[user.school_id] ?? "—") : "—"}
                    </td>
                    <td className={adminTable.td}>
                      <StatusPill tone={STATUS_TONE[user.status] ?? "neutral"}>
                        {user.status}
                      </StatusPill>
                    </td>
                    <td className={`${adminTable.td} text-right`}>
                      {user.role === "creator" && (
                        <UserStatusActions profileId={user.id} status={user.status} showApprove />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <DashboardPagination
          pathname="/dashboard/admin/users"
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalItems={userCount ?? 0}
          query={{ q: query, role, status }}
        />
      </AdminCard>
    </AdminPage>
  );
}
