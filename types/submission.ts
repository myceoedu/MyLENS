import type { SubmissionStatus } from "@/types/auth";
import type { VideoCategory } from "@/lib/data/videos";

export type { SubmissionStatus };

export const VIDEO_CATEGORIES: VideoCategory[] = [
  "Nature",
  "Food",
  "Culture",
  "Heritage",
  "Adventure",
  "Hidden Gems",
];

export interface Submission {
  id: string;
  user_id: string;
  school_id: string;
  title: string;
  description: string | null;
  category: VideoCategory;
  location: string;
  state_id: string;
  video_url: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  draft:     { label: "Draft",       color: "text-zinc-600",   bg: "bg-zinc-100",      border: "border-zinc-200"   },
  submitted: { label: "Submitted",   color: "text-blue-700",   bg: "bg-blue-50",       border: "border-blue-200"   },
  in_review: { label: "In Review",   color: "text-amber-700",  bg: "bg-amber-50",      border: "border-amber-200"  },
  approved:  { label: "Approved",    color: "text-emerald-700",bg: "bg-emerald-50",    border: "border-emerald-200"},
  revision:  { label: "Needs Edits", color: "text-orange-700", bg: "bg-orange-50",     border: "border-orange-200" },
  rejected:  { label: "Rejected",    color: "text-red-700",    bg: "bg-red-50",        border: "border-red-200"    },
};

export const CATEGORY_CONFIG: Record<VideoCategory, { code: string; color: string; bg: string }> = {
  "Nature":      { code: "NAT", color: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200"  },
  "Food":        { code: "FOD", color: "text-amber-800",   bg: "bg-amber-50 border-amber-200"      },
  "Culture":     { code: "CUL", color: "text-indigo-800",  bg: "bg-indigo-50 border-indigo-200"    },
  "Heritage":    { code: "HER", color: "text-stone-800",   bg: "bg-stone-50 border-stone-200"      },
  "Adventure":   { code: "ADV", color: "text-teal-800",    bg: "bg-teal-50 border-teal-200"        },
  "Hidden Gems": { code: "GEM", color: "text-violet-800",  bg: "bg-violet-50 border-violet-200"    },
};
