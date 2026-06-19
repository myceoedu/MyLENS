import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStateLabel } from "@/lib/admin/schools";
import UserStatusActions from "@/components/admin/UserStatusActions";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, school_id, created_at")
    .order("created_at", { ascending: false });

  const schoolIds = [...new Set((users ?? []).map((u) => u.school_id).filter(Boolean))] as string[];
  const schoolNames: Record<string, string> = {};

  if (schoolIds.length > 0) {
    const { data: schools } = await supabase.from("schools").select("id, name").in("id", schoolIds);
    for (const s of schools ?? []) {
      schoolNames[s.id] = s.name;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-emerald-950"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Users
          </h1>
          <p className="text-zinc-600 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
            All LMS accounts across creators, judges, and admins.
          </p>
        </div>
        <Link
          href="/dashboard/admin/users/pending"
          className="bg-white border border-zinc-200/80 hover:border-emerald-200 text-emerald-900 text-sm font-medium rounded-xl px-5 py-3 transition-all"
        >
          Pending approvals →
        </Link>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-3xl shadow-sm overflow-hidden">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
