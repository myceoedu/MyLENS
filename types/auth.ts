export type UserRole = "creator" | "admin";

export type UserStatus = "pending" | "active" | "suspended";

export type SchoolStatus = "pending" | "active" | "archived";

/** Reserved for Phase 4+ — defined now for shared typing */
export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "revision"
  | "rejected";

export const USER_ROLES: UserRole[] = ["creator", "admin"];

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}
