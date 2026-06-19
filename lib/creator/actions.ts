"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionResult = { ok: true } | { ok: false; error: string };

async function requireCreatorClient() {
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

  if (!profile || profile.role !== "creator" || profile.status !== "active") {
    redirect("/dashboard");
  }

  return { supabase, userId: user.id };
}

export async function updateCreatorProfileAction(
  _prev: ProfileActionResult | null,
  formData: FormData
): Promise<ProfileActionResult> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  if (!fullName) {
    return { ok: false, error: "Full name is required." };
  }

  if (bio.length > 500) {
    return { ok: false, error: "Bio must be 500 characters or fewer." };
  }

  if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
    return { ok: false, error: "Avatar URL must start with http:// or https://." };
  }

  const { supabase, userId } = await requireCreatorClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      bio: bio || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/creator/profile");
  revalidatePath("/dashboard/creator/team");
  return { ok: true };
}
