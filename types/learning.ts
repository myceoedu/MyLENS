export type LearningContentType =
  | "live_class"
  | "recorded_video"
  | "document"
  | "external_link";

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

export const LEARNING_CONTENT_LABELS: Record<LearningContentType, string> = {
  live_class: "Live class",
  recorded_video: "Recorded video",
  document: "Document",
  external_link: "External link",
};
