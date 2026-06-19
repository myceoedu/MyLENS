"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MAX_CREATORS_PER_SCHOOL } from "@/lib/config/campaign";
import { generateUniqueAccessToken } from "@/lib/admin/tokens";
import { slugifySchoolName } from "@/lib/admin/schools";
import { createClient } from "@/lib/supabase/server";
import type { SchoolStatus, UserStatus } from "@/types/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

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

export async function createSchoolAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const stateId = String(formData.get("state_id") ?? "").trim();

  if (!name || !stateId) {
    return { ok: false, error: "School name and state are required." };
  }

  const supabase = await requireAdminClient();
  const slug = slugifySchoolName(name);
  const accessToken = await generateUniqueAccessToken(supabase, stateId);

  const { error } = await supabase.from("schools").insert({
    name,
    slug,
    state_id: stateId,
    status: "active",
    access_token: accessToken,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "A school with this name or slug already exists." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/schools");
  return { ok: true };
}

export async function regenerateSchoolTokenAction(schoolId: string): Promise<ActionResult> {
  const supabase = await requireAdminClient();

  const { data: school } = await supabase
    .from("schools")
    .select("state_id")
    .eq("id", schoolId)
    .single();

  if (!school) return { ok: false, error: "School not found." };

  const accessToken = await generateUniqueAccessToken(supabase, school.state_id);

  const { error } = await supabase
    .from("schools")
    .update({ access_token: accessToken })
    .eq("id", schoolId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/admin/schools/${schoolId}`);
  revalidatePath("/dashboard/admin/schools");
  return { ok: true };
}

export async function updateSchoolStatusAction(
  schoolId: string,
  status: SchoolStatus
): Promise<ActionResult> {
  const supabase = await requireAdminClient();

  const { error } = await supabase.from("schools").update({ status }).eq("id", schoolId);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/dashboard/admin/schools/${schoolId}`);
  revalidatePath("/dashboard/admin/schools");
  return { ok: true };
}

export async function approveUserAction(profileId: string): Promise<ActionResult> {
  const supabase = await requireAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, school_id, status")
    .eq("id", profileId)
    .single();

  if (!profile) return { ok: false, error: "User not found." };
  if (profile.status === "active") return { ok: false, error: "User is already active." };

  if (profile.role === "creator" && profile.school_id && profile.status === "pending") {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("school_id", profile.school_id)
      .eq("role", "creator")
      .eq("status", "active");

    if ((count ?? 0) >= MAX_CREATORS_PER_SCHOOL) {
      return {
        ok: false,
        error: `This school already has ${MAX_CREATORS_PER_SCHOOL} active creators. Suspend one before approving.`,
      };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", profileId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/admin/users");
  revalidatePath("/dashboard/admin/users/pending");
  revalidatePath("/dashboard/admin");
  return { ok: true };
}

export async function updateUserStatusAction(
  profileId: string,
  status: UserStatus
): Promise<ActionResult> {
  const supabase = await requireAdminClient();

  const { error } = await supabase.from("profiles").update({ status }).eq("id", profileId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/admin/users");
  revalidatePath("/dashboard/admin/users/pending");
  return { ok: true };
}
