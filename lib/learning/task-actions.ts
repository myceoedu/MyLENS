"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import type { LearningTaskStatus } from "@/types/learning";
import {
  ADMIN_TASK_MODERATION_STATUSES,
  allowedNextTaskStatuses,
  isUuid,
  modeAllowsFile,
  modeAllowsLink,
  modeAllowsText,
  notesRequiredForTask,
} from "@/lib/learning/tasks";
import type { LearningTaskSubmissionMode } from "@/types/learning";

export type TaskActionResult = { ok: true } | { ok: false; error: string };

function refreshTaskViews(itemId?: string, submissionId?: string) {
  revalidatePath("/dashboard/creator/learning");
  revalidatePath("/dashboard/creator/learning/tasks");
  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/admin/learning");
  revalidatePath("/dashboard/admin/learning/assignments");
  revalidatePath("/dashboard/admin/learning/tasks");
  revalidatePath("/dashboard/admin");
  if (itemId) revalidatePath(`/dashboard/admin/learning/tasks`);
  if (submissionId) revalidatePath(`/dashboard/admin/learning/tasks/${submissionId}`);
}

function validHttpUrl(value: string | null) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function cleanOptional(value: string | undefined | null) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}

async function loadTaskItem(itemId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_items")
    .select("id, module_id, title, content_type, published, submission_mode, due_at")
    .eq("id", itemId)
    .maybeSingle();

  if (error || !data) return { error: "Task not found." as const, item: null };
  if (data.content_type !== "task") {
    return { error: "This lesson is not a task." as const, item: null };
  }
  if (!data.published) {
    return { error: "This task is not published yet." as const, item: null };
  }

  const { data: moduleRow } = await supabase
    .from("learning_modules")
    .select("id, published")
    .eq("id", data.module_id)
    .maybeSingle();

  if (!moduleRow?.published) {
    return { error: "This task is not published yet." as const, item: null };
  }

  return {
    error: null,
    item: {
      id: data.id,
      submission_mode: (data.submission_mode ?? "mixed") as LearningTaskSubmissionMode,
      due_at: data.due_at as string | null,
    },
  };
}

function validateAnswer(input: {
  mode: LearningTaskSubmissionMode;
  answerText: string | null;
  answerUrl: string | null;
  storagePath: string | null;
  requireAnswer: boolean;
}): string | null {
  const { mode, answerText, answerUrl, storagePath, requireAnswer } = input;

  if (answerText && answerText.length > 5000) {
    return "Written answers must be 5000 characters or fewer.";
  }
  if (answerUrl && !validHttpUrl(answerUrl)) {
    return "The answer URL must begin with http:// or https://.";
  }
  if (answerText && !modeAllowsText(mode)) {
    return "This task does not accept a written answer.";
  }
  if (answerUrl && !modeAllowsLink(mode)) {
    return "This task does not accept a link.";
  }
  if (storagePath && !modeAllowsFile(mode)) {
    return "This task does not accept a file upload.";
  }

  if (!requireAnswer) return null;

  const hasText = Boolean(answerText);
  const hasLink = Boolean(answerUrl);
  const hasFile = Boolean(storagePath);

  if (mode === "text" && !hasText) return "Write your answer before submitting.";
  if (mode === "link" && !hasLink) return "Add a valid link before submitting.";
  if (mode === "file" && !hasFile) return "Upload a file before submitting.";
  if (mode === "mixed" && !hasText && !hasLink && !hasFile) {
    return "Provide a written answer, link, or file before submitting.";
  }

  return null;
}

export async function saveLearningTaskSubmissionAction(input: {
  itemId: string;
  answerText?: string;
  answerUrl?: string;
  storagePath?: string | null;
  removeFile?: boolean;
  submit?: boolean;
}): Promise<TaskActionResult> {
  const profile = await requireRole(["creator"]);
  if (!isUuid(input.itemId)) return { ok: false, error: "Invalid task id." };

  const { error: itemError, item } = await loadTaskItem(input.itemId);
  if (itemError || !item) return { ok: false, error: itemError ?? "Task not found." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("learning_task_submissions")
    .select("id, status, storage_path, attempt, submitted_at")
    .eq("item_id", input.itemId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing && !["draft", "revision"].includes(existing.status)) {
    return {
      ok: false,
      error: "This task is already under review or finalized. Wait for feedback before editing.",
    };
  }

  const answerText = cleanOptional(input.answerText);
  const answerUrl = cleanOptional(input.answerUrl);
  let storagePath =
    input.storagePath === undefined
      ? (existing?.storage_path ?? null)
      : cleanOptional(input.storagePath);

  if (input.removeFile) storagePath = null;

  const submit = Boolean(input.submit);
  const nextStatus: LearningTaskStatus = submit ? "submitted" : "draft";

  const validationError = validateAnswer({
    mode: item.submission_mode,
    answerText,
    answerUrl,
    storagePath,
    requireAnswer: submit,
  });
  if (validationError) return { ok: false, error: validationError };

  const previousPath = existing?.storage_path ?? null;
  const attempt =
    existing && existing.status === "revision" && submit
      ? existing.attempt + 1
      : (existing?.attempt ?? 1);

  const { error } = await supabase.from("learning_task_submissions").upsert(
    {
      item_id: input.itemId,
      user_id: profile.id,
      school_id: profile.school_id,
      answer_text: answerText,
      answer_url: answerUrl,
      storage_path: storagePath,
      status: nextStatus,
      attempt,
      submitted_at: submit ? new Date().toISOString() : (existing?.submitted_at ?? null),
      ...(submit
        ? {
            reviewed_at: null,
            ...(existing?.status === "revision" ? { admin_notes: null } : {}),
          }
        : {}),
    },
    { onConflict: "user_id,item_id" }
  );

  if (error) return { ok: false, error: error.message };

  if (previousPath && previousPath !== storagePath) {
    await supabase.storage.from("learning-tasks").remove([previousPath]);
  }

  refreshTaskViews(input.itemId);
  return { ok: true };
}

export async function moderateLearningTaskAction(input: {
  submissionId: string;
  expectedStatus: LearningTaskStatus;
  nextStatus: LearningTaskStatus;
  adminNotes: string;
}): Promise<TaskActionResult> {
  await requireRole(["admin"]);
  const { submissionId, expectedStatus, nextStatus } = input;
  const adminNotes = input.adminNotes.trim();

  if (!isUuid(submissionId)) return { ok: false, error: "Invalid submission id." };
  if (!ADMIN_TASK_MODERATION_STATUSES.includes(nextStatus)) {
    return { ok: false, error: "That status cannot be set by admin." };
  }

  const allowed = allowedNextTaskStatuses(expectedStatus);
  if (!allowed.includes(nextStatus)) {
    return {
      ok: false,
      error: `Cannot move from “${expectedStatus}” to “${nextStatus}”. Refresh and try again.`,
    };
  }

  if (notesRequiredForTask(nextStatus) && adminNotes.length < 5) {
    return {
      ok: false,
      error: "Please add clear notes (at least 5 characters) for revision or rejection.",
    };
  }

  const supabase = await createClient();
  const { data: current, error: loadError } = await supabase
    .from("learning_task_submissions")
    .select("id, item_id, user_id, status")
    .eq("id", submissionId)
    .maybeSingle();

  if (loadError || !current) return { ok: false, error: "Task submission not found." };
  if (current.status !== expectedStatus) {
    return {
      ok: false,
      error: "This submission changed since you opened it. Refresh and try again.",
    };
  }

  const { data: updated, error } = await supabase
    .from("learning_task_submissions")
    .update({
      status: nextStatus,
      admin_notes: adminNotes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .eq("status", expectedStatus)
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!updated) {
    return {
      ok: false,
      error: "This submission changed since you opened it. Refresh and try again.",
    };
  }

  if (nextStatus === "approved") {
    const { error: progressError } = await supabase.from("learning_item_progress").upsert(
      {
        user_id: current.user_id,
        item_id: current.item_id,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,item_id", ignoreDuplicates: true }
    );
    if (progressError) return { ok: false, error: progressError.message };
  } else if (current.status === "approved") {
    // Admin reopened a previously approved task (revision / rejected).
    await supabase
      .from("learning_item_progress")
      .delete()
      .eq("user_id", current.user_id)
      .eq("item_id", current.item_id);
  }

  refreshTaskViews(current.item_id, submissionId);
  return { ok: true };
}
