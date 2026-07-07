import { redirect } from "next/navigation";
import { createClient, isStaleRefreshTokenError } from "@/lib/supabase/server";
import type { UserRole } from "@/types/auth";
import type { Profile } from "@/types/profile";
import { isUserRole } from "@/types/auth";

async function resolveUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (isStaleRefreshTokenError(error)) {
    await supabase.auth.signOut();
    return { supabase, user: null };
  }

  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

export async function getSession() {
  const { user } = await resolveUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const { supabase, user } = await resolveUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;

  return profile as Profile;
}

export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireRole(roles: UserRole[]): Promise<Profile> {
  const profile = await requireAuth();

  if (!roles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return profile;
}

export function parseProfileRole(role: string): UserRole | null {
  return isUserRole(role) ? role : null;
}
