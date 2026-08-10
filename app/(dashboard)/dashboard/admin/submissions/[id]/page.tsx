import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import StatusBadge from "@/components/creator/StatusBadge";
import CategoryPill from "@/components/creator/CategoryPill";
import SubmissionVideoPreview from "@/components/admin/SubmissionVideoPreview";
import SubmissionModerationForm from "@/components/admin/SubmissionModerationForm";
import { formatSubmissionDate, isUuid } from "@/lib/admin/submissions";
import { getStateLabel } from "@/lib/admin/schools";
import type { Submission } from "@/types/submission";
import { VIDEO_CATEGORIES } from "@/types/submission";
import type { VideoCategory } from "@/lib/data/videos";

interface PageProps {
  params: Promise<{ id: string }>;
}

function isVideoCategory(value: string): value is VideoCategory {
  return (VIDEO_CATEGORIES as string[]).includes(value);
}

export default async function AdminSubmissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  await requireRole(["admin"]);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const submission = data as Submission;

  const [{ data: profile }, { data: school }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, school_id")
      .eq("id", submission.user_id)
      .maybeSingle(),
    supabase.from("schools").select("id, name").eq("id", submission.school_id).maybeSingle(),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin/submissions"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to submissions
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <header className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={submission.status} />
              {isVideoCategory(submission.category) ? (
                <CategoryPill category={submission.category} />
              ) : (
                <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600">
                  {submission.category}
                </span>
              )}
            </div>
            <h1
              className="font-serif text-3xl font-semibold tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {submission.title}
            </h1>
            {submission.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                {submission.description}
              </p>
            )}

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Creator
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {profile?.full_name ?? "Unknown"}
                  {profile?.email ? (
                    <span className="mt-0.5 block text-zinc-500">{profile.email}</span>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  School
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {school ? (
                    <Link
                      href={`/dashboard/admin/schools/${school.id}`}
                      className="hover:underline"
                    >
                      {school.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Location
                </dt>
                <dd className="mt-1 inline-flex items-start gap-1.5 text-sm text-zinc-900">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B08D3F]" />
                  <span>
                    {submission.location}
                    <span className="block text-zinc-500">
                      {getStateLabel(submission.state_id)}
                    </span>
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Updated
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {formatSubmissionDate(submission.updated_at)}
                  <span className="mt-0.5 block text-zinc-500">
                    Created {formatSubmissionDate(submission.created_at)}
                  </span>
                </dd>
              </div>
            </dl>

            {submission.admin_notes && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  Current admin notes
                </p>
                <p className="mt-1 whitespace-pre-wrap">{submission.admin_notes}</p>
              </div>
            )}
          </header>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">Video</h2>
              {submission.video_url && (
                <a
                  href={submission.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F3A2C] hover:underline"
                >
                  Open original
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <SubmissionVideoPreview
              videoUrl={submission.video_url}
              title={submission.title}
            />
          </section>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <SubmissionModerationForm
            submissionId={submission.id}
            currentStatus={submission.status}
            initialNotes={submission.admin_notes}
          />
        </div>
      </div>
    </div>
  );
}
