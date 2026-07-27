import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Gatekeeper: only confirms a session exists (single `auth.getUser()` call,
 * refreshed via cookies) before letting the request reach the dashboard tree.
 *
 * Account status ("active") and role-based route access are enforced by
 * `requireAuth`/`requireRole` in each dashboard layout — those already fetch
 * (and cache, per-request) the same profile row, so re-fetching it here too
 * was a second redundant Supabase round-trip on every single navigation.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
