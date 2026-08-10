import type {
  LearningTaskStatus,
  LearningTaskSubmissionMode,
} from "@/types/learning";

export const LEARNING_TASK_MODES: LearningTaskSubmissionMode[] = [
  "text",
  "link",
  "file",
  "mixed",
];

export const QUEUE_TASK_STATUSES: LearningTaskStatus[] = ["submitted", "in_review"];

export const ADMIN_TASK_MODERATION_STATUSES: LearningTaskStatus[] = [
  "in_review",
  "approved",
  "revision",
  "rejected",
];

export type AdminTaskFilter =
  | "queue"
  | "all"
  | "submitted"
  | "in_review"
  | "approved"
  | "revision"
  | "rejected"
  | "draft";

export const ADMIN_TASK_FILTERS: AdminTaskFilter[] = [
  "queue",
  "all",
  "submitted",
  "in_review",
  "approved",
  "revision",
  "rejected",
  "draft",
];

export function isAdminTaskFilter(value: string): value is AdminTaskFilter {
  return (ADMIN_TASK_FILTERS as string[]).includes(value);
}

export function statusesForTaskFilter(filter: AdminTaskFilter): LearningTaskStatus[] | null {
  if (filter === "all") return null;
  if (filter === "queue") return QUEUE_TASK_STATUSES;
  return [filter];
}

export function taskFilterLabel(filter: AdminTaskFilter): string {
  switch (filter) {
    case "queue":
      return "Needs review";
    case "all":
      return "All";
    case "submitted":
      return "Submitted";
    case "in_review":
      return "In review";
    case "approved":
      return "Approved";
    case "revision":
      return "Revision";
    case "rejected":
      return "Rejected";
    case "draft":
      return "Draft";
  }
}

export function allowedNextTaskStatuses(current: LearningTaskStatus): LearningTaskStatus[] {
  switch (current) {
    case "submitted":
      return ["in_review", "approved", "revision", "rejected"];
    case "in_review":
      return ["approved", "revision", "rejected"];
    case "revision":
      return ["in_review", "approved", "rejected"];
    case "approved":
      return ["revision", "rejected"];
    case "rejected":
      return ["revision", "approved"];
    case "draft":
      return [];
  }
}

export function notesRequiredForTask(status: LearningTaskStatus): boolean {
  return status === "revision" || status === "rejected";
}

export function isLearningTaskMode(value: string): value is LearningTaskSubmissionMode {
  return (LEARNING_TASK_MODES as string[]).includes(value);
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export function formatTaskDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-MY", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function isTaskEditable(status: LearningTaskStatus): boolean {
  return status === "draft" || status === "revision";
}

export function modeAllowsText(mode: LearningTaskSubmissionMode): boolean {
  return mode === "text" || mode === "mixed";
}

export function modeAllowsLink(mode: LearningTaskSubmissionMode): boolean {
  return mode === "link" || mode === "mixed";
}

export function modeAllowsFile(mode: LearningTaskSubmissionMode): boolean {
  return mode === "file" || mode === "mixed";
}

export type AdminTaskListItem = {
  id: string;
  item_id: string;
  user_id: string;
  school_id: string | null;
  answer_text: string | null;
  answer_url: string | null;
  storage_path: string | null;
  status: LearningTaskStatus;
  admin_notes: string | null;
  attempt: number;
  submitted_at: string | null;
  reviewed_at: string | null;
  updated_at: string;
  task_title: string;
  module_title: string | null;
  creator_name: string | null;
  creator_email: string | null;
  school_name: string | null;
  due_at: string | null;
  submission_mode: LearningTaskSubmissionMode | null;
};
