import { UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import UserStatusActions from "@/components/admin/UserStatusActions";
import AdminSubTabs from "@/components/admin/AdminSubTabs";
import {
  AdminCard,
  AdminEmptyState,
  AdminPage,
  AdminPageHeader,
  adminTable,
} from "@/components/admin/AdminUI";

export default async function AdminPendingUsersPage() {
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, school_id, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const rows = pending ?? [];
  const schoolIds = [...new Set(rows.map((u) => u.school_id).filter(Boolean))] as string[];
  const schoolNames: Record<string, string> = {};

  if (schoolIds.length > 0) {
    const { data: schools } = await supabase.from("schools").select("id, name").in("id", schoolIds);
    for (const s of schools ?? []) {
      schoolNames[s.id] = s.name;
    }
  }

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Account operations"
        title="Pending approval"
        description="Activate creator registrations that are linked to a participating school."
      />

      <AdminSubTabs
        tabs={[
          { href: "/dashboard/admin/users", label: "All accounts", active: false },
          {
            href: "/dashboard/admin/users/pending",
            label: "Pending approval",
            count: rows.length,
            active: true,
          },
        ]}
      />

      <AdminCard>
        {rows.length === 0 ? (
          <AdminEmptyState
            icon={<UserCheck className="h-5 w-5" />}
            title="All approvals are up to date"
            description="New creator registrations with a valid school token will appear here."
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
                  <th className={adminTable.th}>Registered</th>
                  <th className={adminTable.th} />
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.id} className={adminTable.row}>
                    <td className={adminTable.tdStrong}>{user.full_name ?? "—"}</td>
                    <td className={adminTable.td}>{user.email}</td>
                    <td className={`${adminTable.td} capitalize`}>{user.role}</td>
                    <td className={adminTable.td}>
                      {user.school_id ? (schoolNames[user.school_id] ?? "—") : "—"}
                    </td>
                    <td className={`${adminTable.td} text-xs text-zinc-500`}>
                      {new Date(user.created_at).toLocaleDateString("en-MY")}
                    </td>
                    <td className={`${adminTable.td} text-right`}>
                      <UserStatusActions profileId={user.id} status={user.status} showApprove />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </AdminPage>
  );
}
