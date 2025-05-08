export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          isPlanned: boolean
          isPro: boolean
          name: string
          parent_category: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          isPlanned?: boolean
          isPro?: boolean
          name: string
          parent_category: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          isPlanned?: boolean
          isPro?: boolean
          name?: string
          parent_category?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          answers: Json
          category: Database["public"]["Enums"]["question_category"]
          created_at: string
          created_by: string
          difficulty: number
          hint: string | null
          id: string
          image_url: string | null
          question_type: Database["public"]["Enums"]["question_type"]
          regulation_category: string | null
          revision: number
          sub_category: string
          text: string
          updated_at: string
        }
        Insert: {
          answers: Json
          category: Database["public"]["Enums"]["question_category"]
          created_at?: string
          created_by: string
          difficulty: number
          hint?: string | null
          id?: string
          image_url?: string | null
          question_type: Database["public"]["Enums"]["question_type"]
          regulation_category?: string | null
          revision?: number
          sub_category: string
          text: string
          updated_at?: string
        }
        Update: {
          answers?: Json
          category?: Database["public"]["Enums"]["question_category"]
          created_at?: string
          created_by?: string
          difficulty?: number
          hint?: string | null
          id?: string
          image_url?: string | null
          question_type?: Database["public"]["Enums"]["question_type"]
          regulation_category?: string | null
          revision?: number
          sub_category?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          box_number: number
          correct_count: number
          created_at: string
          ease_factor: number
          id: string
          incorrect_count: number
          interval_days: number
          last_reviewed_at: string
          last_score: number
          next_review_at: string
          question_id: string
          repetition_count: number
          streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          box_number?: number
          correct_count?: number
          created_at?: string
          ease_factor?: number
          id?: string
          incorrect_count?: number
          interval_days?: number
          last_reviewed_at?: string
          last_score?: number
          next_review_at?: string
          question_id: string
          repetition_count?: number
          streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          box_number?: number
          correct_count?: number
          created_at?: string
          ease_factor?: number
          id?: string
          incorrect_count?: number
          interval_days?: number
          last_reviewed_at?: string
          last_score?: number
          next_review_at?: string
          question_id?: string
          repetition_count?: number
          streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          created_at: string
          last_activity_date: string
          regulation_preference: string | null
          signals_mastered: number
          streak_days: number
          total_correct: number
          total_incorrect: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          last_activity_date?: string
          regulation_preference?: string | null
          signals_mastered?: number
          streak_days?: number
          total_correct?: number
          total_incorrect?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          last_activity_date?: string
          regulation_preference?: string | null
          signals_mastered?: number
          streak_days?: number
          total_correct?: number
          total_incorrect?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_next_review: {
        Args: { box_num: number }
        Returns: string
      }
    }
    Enums: {
      question_category: "Signale" | "Betriebsdienst"
      question_type: "MC_single" | "MC_multi" | "open"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      question_category: ["Signale", "Betriebsdienst"],
      question_type: ["MC_single", "MC_multi", "open"],
    },
  },
} as const
