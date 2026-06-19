import type { UserRole, UserStatus } from "@/types/auth";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  role: UserRole;
  status: UserStatus;
  school_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
