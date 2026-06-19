import type { UserRole } from "@/types/auth";

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  creator: "/dashboard/creator",
  admin: "/dashboard/admin",
  judge: "/dashboard/judge",
};

const ROLE_ROUTE_PREFIX: Record<UserRole, string> = {
  creator: "/dashboard/creator",
  admin: "/dashboard/admin",
  judge: "/dashboard/judge",
};

export function getDashboardPath(role: UserRole): string {
  return DASHBOARD_ROUTES[role];
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (pathname === "/dashboard") return true;

  const prefix = ROLE_ROUTE_PREFIX[role];
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getRoleFromPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/judge")) return "judge";
  if (pathname.startsWith("/dashboard/creator")) return "creator";
  return null;
}
