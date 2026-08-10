"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/types/auth";
import {
  ADMIN_MODERATION_STATUSES,
  allowedNextStatuses,
  isUuid,
  notesRequiredFor,
} from "@/lib/admin/submissions";

export type ModerateSubmissionResult = { ok: true } | { ok: false; error: string };

async function requireAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || profile.status !== "active") {
    redirect("/dashboard");
  }

  return supabase;
}

function revalidateSubmissionViews(submissionId: string) {
  revalidatePath("/dashboard/admin/submissions");
  revalidatePath(`/dashboard/admin/submissions/${submissionId}`);
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/creator/submissions");
  revalidatePath(`/dashboard/creator/submissions/${submissionId}`);
  revalidatePath("/dashboard/creator");
}

/**
 * Moderate a submission with transition + concurrency guards.
 * Pass expectedStatus so a stale UI cannot overwrite a newer status.
 */
export async function moderateSubmissionAction(input: {
  submissionId: string;
  expectedStatus: SubmissionStatus;
  nextStatus: SubmissionStatus;
  adminNotes: string;
}): Promise<ModerateSubmissionResult> {
  const { submissionId, expectedStatus, nextStatus } = input;
  const adminNotes = input.adminNotes.trim();

  if (!isUuid(submissionId)) {
    return { ok: false, error: "Invalid submission id." };
  }

  if (!ADMIN_MODERATION_STATUSES.includes(nextStatus)) {
    return { ok: false, error: "That status cannot be set by admin." };
  }

  const allowed = allowedNextStatuses(expectedStatus);
  if (!allowed.includes(nextStatus)) {
    return {
      ok: false,
      error: `Cannot move from “${expectedStatus}” to “${nextStatus}”. Refresh and try again.`,
    };
  }

  if (notesRequiredFor(nextStatus) && adminNotes.length < 5) {
    return {
      ok: false,
      error: "Please add clear notes (at least 5 characters) for revision or rejection.",
    };
  }

  if (adminNotes.length > 2000) {
    return { ok: false, error: "Admin notes must be 2000 characters or fewer." };
  }

  const supabase = await requireAdminClient();

  const { data: existing, error: loadError } = await supabase
    .from("submissions")
    .select("id, status, user_id, video_url")
    .eq("id", submissionId)
    .maybeSingle();

  if (loadError) return { ok: false, error: loadError.message };
  if (!existing) return { ok: false, error: "Submission not found." };

  if (existing.status !== expectedStatus) {
    return {
      ok: false,
      error: `This entry changed to “${existing.status}” since you opened it. Refresh and try again.`,
    };
  }

  if (existing.status === "draft") {
    return { ok: false, error: "Draft submissions cannot be moderated until the creator submits." };
  }

  if ((nextStatus === "approved" || nextStatus === "in_review") && !existing.video_url) {
    return { ok: false, error: "Cannot approve or review an entry without a video URL." };
  }

  const notesValue =
    nextStatus === "approved" && !adminNotes
      ? null
      : adminNotes.length > 0
        ? adminNotes
        : null;

  // Concurrency: only update if status is still what the admin saw
  const { data: updated, error } = await supabase
    .from("submissions")
    .update({
      status: nextStatus,
      admin_notes: notesValue,
    })
    .eq("id", submissionId)
    .eq("status", expectedStatus)
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  if (!updated) {
    return {
      ok: false,
      error: "Update did not apply — another change may have landed first. Refresh and try again.",
    };
  }

  revalidateSubmissionViews(submissionId);
  return { ok: true };
}
