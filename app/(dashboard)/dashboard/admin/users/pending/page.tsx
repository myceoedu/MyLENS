import { createClient } from "@/lib/supabase/server";
import UserStatusActions from "@/components/admin/UserStatusActions";
import { DashboardEmptyState, DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { UserCheck } from "lucide-react";

export default async function AdminPendingUsersPage() {
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, school_id, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const schoolIds = [...new Set((pending ?? []).map((u) => u.school_id).filter(Boolean))] as string[];
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
        title="Pending approvals"
        description="Review creator registrations and activate verified accounts associated with a participating school."
      />

      <div className="overflow-hidden rounded-[1.5rem] border border-[#e2ded5] bg-white shadow-[0_16px_34px_-28px_rgba(16,39,28,0.4)]">
        {(pending ?? []).length === 0 ? (
          <DashboardEmptyState
            icon={<UserCheck className="h-5 w-5" />}
            title="All approvals are up to date"
            description="New creator registrations with valid school tokens will appear here."
          />
        ) : (
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
                    Registered
                  </th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {(pending ?? []).map((user) => (
                  <tr key={user.id} className="border-b border-zinc-50 hover:bg-zinc-50/30">
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {user.full_name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{user.email}</td>
                    <td className="px-6 py-4 text-zinc-600 capitalize">{user.role}</td>
                    <td className="px-6 py-4 text-zinc-600">
                      {user.school_id ? (schoolNames[user.school_id] ?? "—") : "—"}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Date(user.created_at).toLocaleDateString("en-MY")}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "creator" ? (
                        <UserStatusActions
                          profileId={user.id}
                          status={user.status}
                          showApprove
                        />
                      ) : (
                        <UserStatusActions profileId={user.id} status={user.status} showApprove />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
