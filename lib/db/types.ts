import type { SchoolStatus, SubmissionStatus, UserRole, UserStatus } from "@/types/auth";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
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
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          state_id: string;
          status?: SchoolStatus;
          access_token?: string | null;
          points?: number;
          rank?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          state_id?: string;
          status?: SchoolStatus;
          access_token?: string | null;
          points?: number;
          rank?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          bio?: string | null;
          role?: UserRole;
          status?: UserStatus;
          school_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          bio?: string | null;
          role?: UserRole;
          status?: UserStatus;
          school_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          resource_type: "link" | "pdf" | "video";
          url: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          resource_type?: "link" | "pdf" | "video";
          url: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          resource_type?: "link" | "pdf" | "video";
          url?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string;
          user_id: string;
          school_id: string;
          title: string;
          description: string | null;
          category: string;
          location: string;
          state_id: string;
          video_url: string | null;
          status: SubmissionStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          school_id: string;
          title: string;
          description?: string | null;
          category: string;
          location: string;
          state_id: string;
          video_url?: string | null;
          status?: SubmissionStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          school_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          location?: string;
          state_id?: string;
          video_url?: string | null;
          status?: SubmissionStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "submissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_settings: {
        Row: {
          id: string;
          submission_opens_at: string | null;
          submission_closes_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          submission_opens_at?: string | null;
          submission_closes_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          submission_opens_at?: string | null;
          submission_closes_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      get_public_participating_schools: {
        Args: { p_state_id?: string | null };
        Returns: {
          id: string;
          state_id: string;
          name: string;
          points: number;
          video_count: number;
          creator_count: number;
        }[];
      };
      get_public_state_stats: {
        Args: Record<string, never>;
        Returns: {
          state_id: string;
          school_count: number;
          video_count: number;
          creator_count: number;
        }[];
      };
      school_creator_count: { Args: { target_school: string }; Returns: number };
      validate_school_registration: {
        Args: { p_school_name: string; p_access_token: string };
        Returns: string | null;
      };
    };
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      school_status: SchoolStatus;
      submission_status: SubmissionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
