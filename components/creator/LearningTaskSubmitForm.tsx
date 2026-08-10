"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  FileUp,
  Loader2,
  Upload,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveLearningTaskSubmissionAction } from "@/lib/learning/task-actions";
import {
  formatTaskDate,
  isTaskEditable,
  modeAllowsFile,
  modeAllowsLink,
  modeAllowsText,
} from "@/lib/learning/tasks";
import {
  LEARNING_TASK_MODE_LABELS,
  LEARNING_TASK_STATUS_LABELS,
  type LearningItem,
  type LearningTaskSubmission,
} from "@/types/learning";
import { cn } from "@/lib/utils";

function safeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

const STATUS_TONE: Record<string, string> = {
  draft: "border-zinc-200 bg-zinc-50 text-zinc-600",
  submitted: "border-amber-200 bg-amber-50 text-amber-700",
  in_review: "border-sky-200 bg-sky-50 text-sky-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  revision: "border-orange-200 bg-orange-50 text-orange-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function LearningTaskSubmitForm({
  item,
  submission,
  userId,
}: {
  item: LearningItem;
  submission: LearningTaskSubmission | null;
  userId: string;
}) {
  const router = useRouter();
  const mode = item.submission_mode ?? "mixed";
  const editable = !submission || isTaskEditable(submission.status);
  const [answerText, setAnswerText] = useState(submission?.answer_text ?? "");
  const [answerUrl, setAnswerUrl] = useState(submission?.answer_url ?? "");
  const [storagePath, setStoragePath] = useState<string | null>(
    submission?.storage_path ?? null
  );
  const [removeFile, setRemoveFile] = useState(false);
  const [fileLabel, setFileLabel] = useState<string | null>(
    submission?.storage_path ? "Current file attached" : null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const dueLabel = item.due_at ? formatTaskDate(item.due_at) : null;

  async function uploadFile(file: File) {
    if (file.size > 20 * 1024 * 1024) {
      setError("Files must be 20 MB or smaller.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const path = `${userId}/${item.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("learning-tasks")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      setStoragePath(path);
      setRemoveFile(false);
      setFileLabel(file.name);
    } finally {
      setUploading(false);
    }
  }

  function runSave(submit: boolean) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await saveLearningTaskSubmissionAction({
        itemId: item.id,
        answerText,
        answerUrl,
        storagePath: removeFile ? null : storagePath,
        removeFile,
        submit,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(submit ? "Task submitted for review." : "Draft saved.");
      router.refresh();
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    runSave(true);
  }

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-[#faf5ea]/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6c26]">
            Submission
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {dueLabel
              ? `${LEARNING_TASK_MODE_LABELS[mode]}, due ${dueLabel}`
              : LEARNING_TASK_MODE_LABELS[mode]}
          </p>
        </div>
        {submission ? (
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
              STATUS_TONE[submission.status] ?? STATUS_TONE.draft
            )}
          >
            {LEARNING_TASK_STATUS_LABELS[submission.status]}
          </span>
        ) : null}
      </div>

      {submission?.admin_notes &&
      (submission.status === "revision" ||
        submission.status === "rejected" ||
        submission.status === "approved") ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
            Mentor feedback
          </p>
          <p className="mt-1 whitespace-pre-wrap">{submission.admin_notes}</p>
        </div>
      ) : null}

      {submission?.status === "approved" ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Approved. This lesson is marked complete.
        </div>
      ) : null}

      {!editable ? (
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
          {submission?.answer_text ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Your answer
              </p>
              <p className="mt-1 whitespace-pre-wrap">{submission.answer_text}</p>
            </div>
          ) : null}
          {submission?.answer_url ? (
            <a
              href={submission.answer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[#0F3A2C] hover:underline"
            >
              Open submitted link
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {submission?.resolved_file_url ? (
            <a
              href={submission.resolved_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[#0F3A2C] hover:underline"
            >
              Open submitted file
              <FileUp className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <p className="text-xs text-zinc-500">
            Submitted {formatTaskDate(submission?.submitted_at)}. Attempt{" "}
            {submission?.attempt ?? 1}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {modeAllowsText(mode) ? (
            <div>
              <label htmlFor={`task-text-${item.id}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Written answer
              </label>
              <textarea
                id={`task-text-${item.id}`}
                value={answerText}
                onChange={(event) => setAnswerText(event.target.value)}
                rows={5}
                maxLength={5000}
                placeholder="Describe your work, reflection, or findings…"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#0F3A2C] focus:ring-2 focus:ring-[#0F3A2C]/10"
              />
              <p className="mt-1 text-right text-[11px] text-zinc-400">
                {answerText.length}/5000
              </p>
            </div>
          ) : null}

          {modeAllowsLink(mode) ? (
            <div>
              <label htmlFor={`task-url-${item.id}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Link / URL
              </label>
              <input
                id={`task-url-${item.id}`}
                type="url"
                value={answerUrl}
                onChange={(event) => setAnswerUrl(event.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[#0F3A2C] focus:ring-2 focus:ring-[#0F3A2C]/10"
              />
            </div>
          ) : null}

          {modeAllowsFile(mode) ? (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                File upload
              </p>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-4 text-sm text-zinc-600 hover:border-violet-300">
                <Upload className="h-4 w-4 text-violet-700" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                  disabled={uploading || pending}
                  className="min-w-0 text-xs"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadFile(file);
                  }}
                />
              </label>
              <p className="mt-1.5 text-xs text-zinc-500">
                Max 20 MB. {fileLabel ? `Selected: ${fileLabel}` : "No file attached yet."}
              </p>
              {(storagePath || submission?.storage_path) && !removeFile ? (
                <label className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                  <input
                    type="checkbox"
                    checked={removeFile}
                    onChange={(event) => {
                      setRemoveFile(event.target.checked);
                      if (event.target.checked) {
                        setStoragePath(null);
                        setFileLabel(null);
                      }
                    }}
                  />
                  Remove attached file
                </label>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {success}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending || uploading}
              onClick={() => runSave(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-zinc-300 disabled:opacity-60"
            >
              Save draft
            </button>
            <button
              type="submit"
              disabled={pending || uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F3A2C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#175a44] disabled:opacity-60"
            >
              {pending || uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {submission?.status === "revision" ? "Resubmit for review" : "Submit for review"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
