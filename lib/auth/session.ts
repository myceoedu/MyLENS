import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient, isStaleRefreshTokenError } from "@/lib/supabase/server";
import type { UserRole } from "@/types/auth";
import type { Profile } from "@/types/profile";
import { isUserRole } from "@/types/auth";

/**
 * Memoized per-request — the dashboard layout, role layouts (admin/creator),
 * and the page itself each call this; without caching that's a repeated
 * auth.getUser() network round-trip for every level of nesting.
 */
const resolveUser = cache(async function resolveUser() {
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
});

export async function getSession() {
  const { user } = await resolveUser();
  return user;
}

/** Memoized per-request alongside `resolveUser` — see note above. */
export const getCurrentProfile = cache(async function getCurrentProfile(): Promise<Profile | null> {
  const { supabase, user } = await resolveUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, bio, role, status, school_id, avatar_url, created_at, updated_at"
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;

  return profile as Profile;
});

export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  // Previously enforced in proxy.ts on every request (extra Supabase round-trip
  // per navigation); moved here where the profile is already fetched & cached.
  if (profile.status !== "active") {
    redirect("/login?error=account_inactive");
  }

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
