export type LearningContentType =
  | "live_class"
  | "recorded_video"
  | "document"
  | "external_link"
  | "task";

export type LearningTaskSubmissionMode = "text" | "link" | "file" | "mixed";

export type LearningTaskStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "revision"
  | "rejected";

export interface LearningItem {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content_type: LearningContentType;
  content_url: string | null;
  storage_path: string | null;
  starts_at: string | null;
  duration_minutes: number | null;
  sort_order: number;
  published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  submission_mode?: LearningTaskSubmissionMode | null;
  due_at?: string | null;
  resolved_url?: string | null;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  items: LearningItem[];
}

export interface LearningTaskSubmission {
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
  created_at: string;
  updated_at: string;
  resolved_file_url?: string | null;
}

export const LEARNING_CONTENT_LABELS: Record<LearningContentType, string> = {
  live_class: "Live class",
  recorded_video: "Recorded video",
  document: "Document",
  external_link: "External link",
  task: "Task",
};

export const LEARNING_TASK_MODE_LABELS: Record<LearningTaskSubmissionMode, string> = {
  text: "Written answer",
  link: "Link / URL",
  file: "File upload",
  mixed: "Text, link, or file",
};

export const LEARNING_TASK_STATUS_LABELS: Record<LearningTaskStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  approved: "Approved",
  revision: "Needs revision",
  rejected: "Rejected",
};
