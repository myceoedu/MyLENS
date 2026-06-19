"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { VideoCategory } from "@/lib/data/videos";
import { VIDEO_CATEGORIES } from "@/types/submission";

export type SubmissionActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

async function requireCreatorWithSchool() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, status, school_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "creator" || profile.status !== "active") {
    redirect("/dashboard");
  }

  if (!profile.school_id) {
    return { supabase, userId: user.id, schoolId: null as string | null };
  }

  return { supabase, userId: user.id, schoolId: profile.school_id as string };
}

function validateSubmissionForm(formData: FormData): {
  ok: true;
  fields: {
    title: string;
    description: string | null;
    category: VideoCategory;
    location: string;
    state_id: string;
    video_url: string | null;
  };
} | { ok: false; error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const state_id = String(formData.get("state_id") ?? "").trim();
  const video_url = String(formData.get("video_url") ?? "").trim() || null;

  if (!title) return { ok: false, error: "Title is required." };
  if (title.length > 120) return { ok: false, error: "Title must be 120 characters or fewer." };
  if (!VIDEO_CATEGORIES.includes(category as VideoCategory)) {
    return { ok: false, error: "Please select a valid tourism category." };
  }
  if (!location) return { ok: false, error: "Filming location is required." };
  if (!state_id) return { ok: false, error: "State is required." };
  if (video_url && !/^https?:\/\//i.test(video_url)) {
    return { ok: false, error: "Video URL must start with http:// or https://." };
  }
  if (description && description.length > 1000) {
    return { ok: false, error: "Description must be 1000 characters or fewer." };
  }

  return {
    ok: true,
    fields: { title, description, category: category as VideoCategory, location, state_id, video_url },
  };
}

/** Create a new DRAFT submission */
export async function createSubmissionAction(
  _prev: SubmissionActionResult | null,
  formData: FormData
): Promise<SubmissionActionResult> {
  const validated = validateSubmissionForm(formData);
  if (!validated.ok) return validated;

  const { supabase, userId, schoolId } = await requireCreatorWithSchool();
  if (!schoolId) return { ok: false, error: "You must be assigned to a school before submitting." };

  const { data, error } = await supabase
    .from("submissions")
    .insert({ ...validated.fields, user_id: userId, school_id: schoolId, status: "draft" })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/creator/submissions");
  revalidatePath("/dashboard/creator");
  redirect(`/dashboard/creator/submissions/${data.id}`);
}

/** Save changes to an existing draft or revision */
export async function updateSubmissionAction(
  submissionId: string,
  _prev: SubmissionActionResult | null,
  formData: FormData
): Promise<SubmissionActionResult> {
  const validated = validateSubmissionForm(formData);
  if (!validated.ok) return validated;

  const { supabase, userId } = await requireCreatorWithSchool();

  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status, user_id")
    .eq("id", submissionId)
    .single();

  if (!existing) return { ok: false, error: "Submission not found." };
  if (existing.user_id !== userId) return { ok: false, error: "Access denied." };
  if (existing.status !== "draft" && existing.status !== "revision") {
    return { ok: false, error: "Only draft or revision submissions can be edited." };
  }

  const { error } = await supabase
    .from("submissions")
    .update(validated.fields)
    .eq("id", submissionId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/creator/submissions/${submissionId}`);
  revalidatePath("/dashboard/creator/submissions");
  return { ok: true };
}

/** Lock and submit a draft for review */
export async function submitForReviewAction(submissionId: string): Promise<SubmissionActionResult> {
  const { supabase, userId } = await requireCreatorWithSchool();

  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status, user_id, title, video_url, location, category")
    .eq("id", submissionId)
    .single();

  if (!existing) return { ok: false, error: "Submission not found." };
  if (existing.user_id !== userId) return { ok: false, error: "Access denied." };
  if (existing.status !== "draft" && existing.status !== "revision") {
    return { ok: false, error: "Only draft or revision submissions can be submitted." };
  }

  const { error } = await supabase
    .from("submissions")
    .update({ status: "submitted" })
    .eq("id", submissionId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/creator/submissions/${submissionId}`);
  revalidatePath("/dashboard/creator/submissions");
  revalidatePath("/dashboard/creator");
  return { ok: true };
}

/** Delete a draft submission */
export async function deleteSubmissionAction(submissionId: string): Promise<SubmissionActionResult> {
  const { supabase, userId } = await requireCreatorWithSchool();

  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status, user_id")
    .eq("id", submissionId)
    .single();

  if (!existing) return { ok: false, error: "Submission not found." };
  if (existing.user_id !== userId) return { ok: false, error: "Access denied." };
  if (existing.status !== "draft") {
    return { ok: false, error: "Only draft submissions can be deleted." };
  }

  const { error } = await supabase.from("submissions").delete().eq("id", submissionId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/creator/submissions");
  revalidatePath("/dashboard/creator");
  redirect("/dashboard/creator/submissions");
}
