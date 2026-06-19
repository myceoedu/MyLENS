import Link from "next/link";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { createClient } from "@/lib/supabase/server";
import { getStateLabel } from "@/lib/admin/schools";
import TokenCopyButton from "@/components/admin/TokenCopyButton";

export default async function AdminSchoolsPage() {
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from("schools")
    .select("id, name, state_id, status, access_token, created_at")
    .order("name");

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-emerald-950"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Schools
          </h1>
          <p className="text-zinc-600 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
            Manage participating schools and event access tokens.
          </p>
        </div>
        <Link
          href="/dashboard/admin/schools/new"
          className="bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-medium rounded-xl px-5 py-3 transition-all"
        >
          + Add School
        </Link>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-3xl shadow-sm overflow-hidden">
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
                    No schools yet.{" "}
                    <Link href="/dashboard/admin/schools/new" className="text-emerald-700 underline">
                      Add your first school
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
