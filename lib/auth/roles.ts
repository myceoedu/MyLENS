import type { UserRole } from "@/types/auth";

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  creator: "/dashboard/creator",
  admin: "/dashboard/admin",
};

const ROLE_ROUTE_PREFIX: Record<UserRole, string> = {
  creator: "/dashboard/creator",
  admin: "/dashboard/admin",
};

export function getDashboardPath(role: UserRole | string): string {
  if (role === "admin") return DASHBOARD_ROUTES.admin;
  if (role === "creator") return DASHBOARD_ROUTES.creator;
  // Unsupported roles (including legacy judge) have no workspace.
  return "/login?error=account_inactive";
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (pathname === "/dashboard") return true;

  const prefix = ROLE_ROUTE_PREFIX[role];
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getRoleFromPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/creator")) return "creator";
  return null;
}
