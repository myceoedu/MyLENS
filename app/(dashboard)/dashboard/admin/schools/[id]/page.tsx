import { notFound } from "next/navigation";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { createClient } from "@/lib/supabase/server";
import { getStateLabel } from "@/lib/admin/schools";
import TokenCopyButton from "@/components/admin/TokenCopyButton";
import RegenerateTokenButton from "@/components/admin/RegenerateTokenButton";
import SchoolStatusSelect from "@/components/admin/SchoolStatusSelect";
import UserStatusActions from "@/components/admin/UserStatusActions";
import {
  AdminBreadcrumbs,
  AdminCard,
  AdminPage,
  AdminPageHeader,
  StatusPill,
} from "@/components/admin/AdminUI";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_TONE = {
  active: "emerald",
  pending: "amber",
  suspended: "rose",
} as const;

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

  const roster = creators ?? [];
  const activeCount = roster.filter((c) => c.status === "active").length;
  const pendingCount = roster.filter((c) => c.status === "pending").length;

  return (
    <AdminPage>
      <AdminBreadcrumbs
        items={[{ label: "Schools", href: "/dashboard/admin/schools" }, { label: school.name }]}
      />

      <AdminPageHeader
        eyebrow={getStateLabel(school.state_id)}
        title={school.name}
        description={`${activeCount} active · ${pendingCount} pending · maximum ${MAX_CREATORS_PER_SCHOOL} creators`}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard className="space-y-5 p-6">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Event access token</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Share this token with the school coordinator. Students need the exact school name and
              this token to register.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {school.access_token ? (
              <TokenCopyButton token={school.access_token} />
            ) : (
              <p className="text-sm text-zinc-500">No token set.</p>
            )}
            <RegenerateTokenButton schoolId={school.id} />
          </div>

          <div className="border-t border-zinc-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              School status
            </p>
            <SchoolStatusSelect schoolId={school.id} currentStatus={school.status} />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="text-sm font-semibold text-zinc-900">
            Creators{" "}
            <span className="font-normal tabular-nums text-zinc-500">
              {roster.length}/{MAX_CREATORS_PER_SCHOOL}
            </span>
          </h2>

          {roster.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No creators linked yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {roster.map((creator) => (
                <li
                  key={creator.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {creator.full_name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{creator.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone={STATUS_TONE[creator.status] ?? "neutral"}>
                      {creator.status}
                    </StatusPill>
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
        </AdminCard>
      </div>
    </AdminPage>
  );
}
