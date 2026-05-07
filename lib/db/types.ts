export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          github_username: string | null;
          github_profile_url: string | null;
          default_repo_owner: string | null;
          default_repo_name: string | null;
          preferred_ai_provider: "none" | "openai" | "gemini" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          github_username?: string | null;
          github_profile_url?: string | null;
          default_repo_owner?: string | null;
          default_repo_name?: string | null;
          preferred_ai_provider?: "none" | "openai" | "gemini" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          github_username?: string | null;
          github_profile_url?: string | null;
          default_repo_owner?: string | null;
          default_repo_name?: string | null;
          preferred_ai_provider?: "none" | "openai" | "gemini" | null;
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
        ];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          source_type: "github_pr" | "diff_upload";
          pr_url: string | null;
          repo_owner: string | null;
          repo_name: string | null;
          pr_number: number | null;
          title: string | null;
          author: string | null;
          overall_risk_score: number;
          risk_level: "low" | "medium" | "high" | "critical";
          ai_summary: string | null;
          suggested_tests: string | null;
          raw_diff: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: "github_pr" | "diff_upload";
          pr_url?: string | null;
          repo_owner?: string | null;
          repo_name?: string | null;
          pr_number?: number | null;
          title?: string | null;
          author?: string | null;
          overall_risk_score?: number;
          risk_level?: "low" | "medium" | "high" | "critical";
          ai_summary?: string | null;
          suggested_tests?: string | null;
          raw_diff?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_type?: "github_pr" | "diff_upload";
          pr_url?: string | null;
          repo_owner?: string | null;
          repo_name?: string | null;
          pr_number?: number | null;
          title?: string | null;
          author?: string | null;
          overall_risk_score?: number;
          risk_level?: "low" | "medium" | "high" | "critical";
          ai_summary?: string | null;
          suggested_tests?: string | null;
          raw_diff?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      review_files: {
        Row: {
          id: string;
          review_id: string;
          file_path: string;
          status: string | null;
          additions: number;
          deletions: number;
          patch: string | null;
          risk_score: number;
          risk_level: "low" | "medium" | "high" | "critical";
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          file_path: string;
          status?: string | null;
          additions?: number;
          deletions?: number;
          patch?: string | null;
          risk_score?: number;
          risk_level?: "low" | "medium" | "high" | "critical";
          created_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          file_path?: string;
          status?: string | null;
          additions?: number;
          deletions?: number;
          patch?: string | null;
          risk_score?: number;
          risk_level?: "low" | "medium" | "high" | "critical";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "review_files_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      review_issues: {
        Row: {
          id: string;
          review_id: string;
          file_id: string | null;
          severity: "low" | "medium" | "high" | "critical";
          category: string;
          title: string;
          description: string | null;
          recommendation: string | null;
          line_number: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          file_id?: string | null;
          severity: "low" | "medium" | "high" | "critical";
          category: string;
          title: string;
          description?: string | null;
          recommendation?: string | null;
          line_number?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          file_id?: string | null;
          severity?: "low" | "medium" | "high" | "critical";
          category?: string;
          title?: string;
          description?: string | null;
          recommendation?: string | null;
          line_number?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "review_issues_file_id_fkey";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "review_files";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_issues_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
export type ReviewFileRow = Database["public"]["Tables"]["review_files"]["Row"];
export type ReviewFileInsert = Database["public"]["Tables"]["review_files"]["Insert"];
export type ReviewIssueRow = Database["public"]["Tables"]["review_issues"]["Row"];
export type ReviewIssueInsert = Database["public"]["Tables"]["review_issues"]["Insert"];
