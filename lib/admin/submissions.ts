import type { SubmissionStatus } from "@/types/auth";
import type { VideoCategory } from "@/lib/data/videos";

export type AdminSubmissionFilter =
  | "queue"
  | "all"
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "revision"
  | "rejected";

export const ADMIN_SUBMISSION_FILTERS: AdminSubmissionFilter[] = [
  "queue",
  "submitted",
  "in_review",
  "approved",
  "revision",
  "rejected",
  "draft",
  "all",
];

export const ADMIN_MODERATION_STATUSES: SubmissionStatus[] = [
  "in_review",
  "approved",
  "revision",
  "rejected",
];

/** Statuses that still need an admin decision. */
export const QUEUE_STATUSES: SubmissionStatus[] = ["submitted", "in_review"];

export type AdminSubmissionListItem = {
  id: string;
  user_id: string;
  school_id: string;
  title: string;
  category: VideoCategory | string;
  location: string;
  state_id: string;
  video_url: string | null;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
  school_name: string | null;
  creator_name: string | null;
  creator_email: string | null;
};

export function isAdminSubmissionFilter(value: string): value is AdminSubmissionFilter {
  return ADMIN_SUBMISSION_FILTERS.includes(value as AdminSubmissionFilter);
}

export function statusesForFilter(filter: AdminSubmissionFilter): SubmissionStatus[] | null {
  if (filter === "all") return null;
  if (filter === "queue") return QUEUE_STATUSES;
  return [filter];
}

export function filterLabel(filter: AdminSubmissionFilter): string {
  switch (filter) {
    case "queue":
      return "Needs review";
    case "all":
      return "All";
    case "in_review":
      return "In review";
    case "revision":
      return "Needs edits";
    default:
      return filter.charAt(0).toUpperCase() + filter.slice(1);
  }
}

/** Allowed next statuses from the current one (prevents illegal jumps). */
export function allowedNextStatuses(current: SubmissionStatus): SubmissionStatus[] {
  switch (current) {
    case "submitted":
      return ["in_review", "approved", "revision", "rejected"];
    case "in_review":
      return ["approved", "revision", "rejected"];
    case "approved":
      return ["in_review", "revision"];
    case "revision":
      return ["in_review", "approved", "rejected"];
    case "rejected":
      return ["in_review"];
    case "draft":
    default:
      return [];
  }
}

export function notesRequiredFor(status: SubmissionStatus): boolean {
  return status === "revision" || status === "rejected";
}

export function formatSubmissionDate(iso: string): string {
  return new Date(iso).toLocaleString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
