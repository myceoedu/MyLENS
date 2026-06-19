import type { SchoolStatus } from "@/types/auth";

export interface School {
  id: string;
  slug: string;
  name: string;
  state_id: string;
  status: SchoolStatus;
  access_token: string | null;
  points: number;
  rank: number | null;
  created_at: string;
  updated_at: string;
}
