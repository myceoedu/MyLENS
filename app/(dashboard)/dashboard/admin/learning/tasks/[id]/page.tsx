import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileUp } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getAdminTaskSubmissionDetail } from "@/lib/learning/queries";
import { formatTaskDate, isUuid } from "@/lib/learning/tasks";
import LearningTaskModerationForm from "@/components/admin/LearningTaskModerationForm";
import {
  AdminBreadcrumbs,
  AdminCard,
  AdminPage,
  StatusPill,
} from "@/components/admin/AdminUI";
import {
  LEARNING_TASK_MODE_LABELS,
  LEARNING_TASK_STATUS_LABELS,
  type LearningTaskStatus,
} from "@/types/learning";

const STATUS_TONE = {
  draft: "neutral",
  submitted: "amber",
  in_review: "sky",
  approved: "emerald",
  revision: "brass",
  rejected: "rose",
} as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLearningTaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  await requireRole(["admin"]);

  let detail: Awaited<ReturnType<typeof getAdminTaskSubmissionDetail>> = null;
  try {
    detail = await getAdminTaskSubmissionDetail(id);
  } catch {
    notFound();
  }
  if (!detail?.submission || !detail.task) notFound();

  const { submission, task, creator, school } = detail;
  const status = submission.status as LearningTaskStatus;

  return (
    <AdminPage>
      <AdminBreadcrumbs
        items={[
          { label: "Learning", href: "/dashboard/admin/learning" },
          { label: "Reviews", href: "/dashboard/admin/learning/tasks" },
          { label: task.title },
        ]}
      />

      <Link
        href="/dashboard/admin/learning/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to reviews
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <AdminCard className="p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusPill tone={STATUS_TONE[status] ?? "neutral"}>
                {LEARNING_TASK_STATUS_LABELS[status]}
              </StatusPill>
              {task.module_title ? (
                <span className="text-xs text-zinc-400">{task.module_title}</span>
              ) : null}
            </div>

            <h1
              className="font-serif text-3xl font-semibold tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {task.title}
            </h1>
            {task.description ? (
              <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                {task.description}
              </p>
            ) : null}

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Creator
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {creator?.full_name ?? "Unknown"}
                  {creator?.email ? (
                    <span className="mt-0.5 block text-zinc-500">{creator.email}</span>
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
                  Format
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {task.submission_mode
                    ? LEARNING_TASK_MODE_LABELS[task.submission_mode]
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Timeline
                </dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  Submitted {formatTaskDate(submission.submitted_at)}
                  <span className="mt-0.5 block text-zinc-500">
                    Attempt {submission.attempt}
                    {task.due_at ? ` · Due ${formatTaskDate(task.due_at)}` : ""}
                  </span>
                </dd>
              </div>
            </dl>
          </AdminCard>

          <AdminCard className="space-y-4 p-6">
            <h2 className="text-sm font-semibold text-zinc-900">Submitted work</h2>

            {submission.answer_text ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  Written answer
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                  {submission.answer_text}
                </p>
              </div>
            ) : null}

            {submission.answer_url ? (
              <a
                href={submission.answer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F3A2C] hover:underline"
              >
                Open submitted link
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}

            {submission.resolved_file_url ? (
              <a
                href={submission.resolved_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F3A2C] hover:underline"
              >
                Open submitted file
                <FileUp className="h-3.5 w-3.5" />
              </a>
            ) : null}

            {!submission.answer_text &&
            !submission.answer_url &&
            !submission.resolved_file_url ? (
              <p className="text-sm text-zinc-500">No answer content attached.</p>
            ) : null}

            {submission.admin_notes ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  Current mentor notes
                </p>
                <p className="mt-1 whitespace-pre-wrap">{submission.admin_notes}</p>
              </div>
            ) : null}
          </AdminCard>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <LearningTaskModerationForm
            submissionId={submission.id}
            currentStatus={status}
            initialNotes={submission.admin_notes}
          />
        </div>
      </div>
    </AdminPage>
  );
}
