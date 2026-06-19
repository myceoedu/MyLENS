import Link from "next/link";
import { notFound } from "next/navigation";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { createClient } from "@/lib/supabase/server";
import { getStateLabel } from "@/lib/admin/schools";
import TokenCopyButton from "@/components/admin/TokenCopyButton";
import RegenerateTokenButton from "@/components/admin/RegenerateTokenButton";
import SchoolStatusSelect from "@/components/admin/SchoolStatusSelect";
import UserStatusActions from "@/components/admin/UserStatusActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSchoolDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase.from("schools").select("*").eq("id", id).single();

  if (!school) notFound();

  const { data: creators } = await supabase
    .from("profiles")
    .select("id, full_name, email, status, created_at")
    .eq("school_id", id)
    .eq("role", "creator")
    .order("created_at", { ascending: false });

  const activeCount = (creators ?? []).filter((c) => c.status === "active").length;
  const pendingCount = (creators ?? []).filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/schools"
          className="text-sm text-emerald-800 hover:text-emerald-950"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Back to schools
        </Link>
        <h1
          className="text-2xl font-bold text-emerald-950 mt-3"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {school.name}
        </h1>
        <p className="text-zinc-600 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
          {getStateLabel(school.state_id)} · {activeCount} active, {pendingCount} pending · max{" "}
          {MAX_CREATORS_PER_SCHOOL} creators
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-sm space-y-6">
          <h2
            className="text-lg font-semibold text-emerald-950"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Event Access Token
          </h2>
          <p className="text-sm text-zinc-600" style={{ fontFamily: "var(--font-inter)" }}>
            Share this token with the school coordinator. Students need the exact school name and
            this token to register.
          </p>
          {school.access_token ? (
            <TokenCopyButton token={school.access_token} />
          ) : (
            <p className="text-zinc-500 text-sm">No token set.</p>
          )}
          <RegenerateTokenButton schoolId={school.id} />

          <div>
            <p
              className="text-[0.65rem] uppercase tracking-widest text-emerald-700 font-semibold mb-2"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              School Status
            </p>
            <SchoolStatusSelect schoolId={school.id} currentStatus={school.status} />
          </div>
        </section>

        <section className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-sm">
          <h2
            className="text-lg font-semibold text-emerald-950 mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Creators ({(creators ?? []).length}/{MAX_CREATORS_PER_SCHOOL})
          </h2>
          {(creators ?? []).length === 0 ? (
            <p className="text-sm text-zinc-500">No creators linked yet.</p>
          ) : (
            <ul className="space-y-3">
              {(creators ?? []).map((creator) => (
                <li
                  key={creator.id}
                  className="flex items-center justify-between gap-3 border border-zinc-100 rounded-xl p-3"
                >
                  <div>
                    <p className="font-medium text-zinc-900 text-sm">
                      {creator.full_name ?? "—"}
                    </p>
                    <p className="text-xs text-zinc-500">{creator.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        creator.status === "active"
                          ? "text-xs text-emerald-700 font-medium"
                          : creator.status === "pending"
                            ? "text-xs text-amber-600 font-medium"
                            : "text-xs text-zinc-500"
                      }
                    >
                      {creator.status}
                    </span>
                    <UserStatusActions
                      profileId={creator.id}
                      status={creator.status}
                      showApprove
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
