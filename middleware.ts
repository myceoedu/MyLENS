import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { canAccessRoute, getDashboardPath } from "@/lib/auth/roles";
import { isUserRole } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "active") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("error", "account_inactive");
    return NextResponse.redirect(loginUrl);
  }

  const role = isUserRole(profile.role) ? profile.role : null;

  if (!role) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("error", "invalid_role");
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/dashboard") {
    return supabaseResponse;
  }

  if (!canAccessRoute(role, pathname)) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
