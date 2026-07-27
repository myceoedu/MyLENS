"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import type { LearningContentType } from "@/types/learning";

export type LearningActionResult = { ok: true } | { ok: false; error: string };

export interface LearningModuleInput {
  id?: string;
  title: string;
  description?: string;
  sortOrder?: number;
  published?: boolean;
}

export interface LearningItemInput {
  id?: string;
  moduleId: string;
  title: string;
  description?: string;
  contentType: LearningContentType;
  contentUrl?: string;
  storagePath?: string;
  startsAt?: string;
  durationMinutes?: number;
  sortOrder?: number;
  published?: boolean;
}

const VALID_CONTENT_TYPES: LearningContentType[] = [
  "live_class",
  "recorded_video",
  "document",
  "external_link",
];

async function requireAdminClient() {
  const profile = await requireRole(["admin"]);
  const supabase = await createClient();
  return { profile, supabase };
}

function cleanOptional(value: string | undefined) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
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

function refreshLearningPages() {
  revalidatePath("/dashboard/admin/learning");
  revalidatePath("/dashboard/creator/learning");
}

export async function setLearningItemCompletionAction(
  itemId: string,
  completed: boolean
): Promise<LearningActionResult> {
  const profile = await requireRole(["creator"]);
  const supabase = await createClient();

  const { error } = completed
    ? await supabase
        .from("learning_item_progress")
        .upsert(
          { user_id: profile.id, item_id: itemId },
          { onConflict: "user_id,item_id", ignoreDuplicates: true }
        )
    : await supabase
        .from("learning_item_progress")
        .delete()
        .eq("user_id", profile.id)
        .eq("item_id", itemId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/creator/learning");
  return { ok: true };
}

export async function saveLearningModuleAction(
  input: LearningModuleInput
): Promise<LearningActionResult> {
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Module title is required." };
  if (title.length > 120) return { ok: false, error: "Module title is too long." };

  const { supabase } = await requireAdminClient();
  const values = {
    title,
    description: cleanOptional(input.description),
    sort_order: Math.max(0, Math.trunc(input.sortOrder ?? 0)),
    published: input.published ?? false,
  };

  const query = input.id
    ? supabase.from("learning_modules").update(values).eq("id", input.id)
    : supabase.from("learning_modules").insert(values);
  const { error } = await query;

  if (error) return { ok: false, error: error.message };
  refreshLearningPages();
  return { ok: true };
}

export async function saveLearningItemAction(
  input: LearningItemInput
): Promise<LearningActionResult> {
  const title = input.title.trim();
  const contentUrl = cleanOptional(input.contentUrl);
  const storagePath = cleanOptional(input.storagePath);

  if (!input.moduleId) return { ok: false, error: "Select a module." };
  if (!title) return { ok: false, error: "Content title is required." };
  if (!VALID_CONTENT_TYPES.includes(input.contentType)) {
    return { ok: false, error: "Choose a valid content type." };
  }
  if (!contentUrl && !storagePath) {
    return { ok: false, error: "Provide a URL or upload a file." };
  }
  if (!validHttpUrl(contentUrl)) {
    return { ok: false, error: "The content URL must begin with http:// or https://." };
  }
  if (input.contentType === "live_class" && !input.startsAt) {
    return { ok: false, error: "Live classes require a date and time." };
  }

  const { profile, supabase } = await requireAdminClient();
  const values = {
    module_id: input.moduleId,
    title,
    description: cleanOptional(input.description),
    content_type: input.contentType,
    content_url: contentUrl,
    storage_path: storagePath,
    starts_at: input.contentType === "live_class" ? cleanOptional(input.startsAt) : null,
    duration_minutes:
      input.durationMinutes && input.durationMinutes > 0
        ? Math.trunc(input.durationMinutes)
        : null,
    sort_order: Math.max(0, Math.trunc(input.sortOrder ?? 0)),
    published: input.published ?? false,
    created_by: profile.id,
  };

  const query = input.id
    ? supabase.from("learning_items").update(values).eq("id", input.id)
    : supabase.from("learning_items").insert(values);
  const { error } = await query;

  if (error) return { ok: false, error: error.message };
  refreshLearningPages();
  return { ok: true };
}

export async function toggleLearningModuleAction(
  id: string,
  published: boolean
): Promise<LearningActionResult> {
  const { supabase } = await requireAdminClient();
  const { error } = await supabase.from("learning_modules").update({ published }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  refreshLearningPages();
  return { ok: true };
}

export async function toggleLearningItemAction(
  id: string,
  published: boolean
): Promise<LearningActionResult> {
  const { supabase } = await requireAdminClient();
  const { error } = await supabase.from("learning_items").update({ published }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  refreshLearningPages();
  return { ok: true };
}

export async function deleteLearningModuleAction(id: string): Promise<LearningActionResult> {
  const { supabase } = await requireAdminClient();

  const { data: items } = await supabase
    .from("learning_items")
    .select("storage_path")
    .eq("module_id", id);
  const storagePaths = (items ?? [])
    .map((item) => item.storage_path)
    .filter((path): path is string => Boolean(path));

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("learning-content")
      .remove(storagePaths);
    if (storageError) return { ok: false, error: storageError.message };
  }

  const { error } = await supabase.from("learning_modules").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  refreshLearningPages();
  return { ok: true };
}

export async function deleteLearningItemAction(id: string): Promise<LearningActionResult> {
  const { supabase } = await requireAdminClient();
  const { data: item } = await supabase
    .from("learning_items")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (item?.storage_path) {
    const { error: storageError } = await supabase.storage
      .from("learning-content")
      .remove([item.storage_path]);
    if (storageError) return { ok: false, error: storageError.message };
  }

  const { error } = await supabase.from("learning_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  refreshLearningPages();
  return { ok: true };
}
