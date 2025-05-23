
import { Json } from "@/integrations/supabase/types";
import { StructuredContent } from "./rich-text";

export type QuestionCategory = 'Signale' | 'Betriebsdienst';
export type QuestionType = 'MC_single' | 'MC_multi' | 'open';
export type RegulationCategory = 'DS 301' | 'DV 301' | 'both';
export type RegulationFilterType = RegulationCategory | 'all';

export interface Answer {
  text: string | StructuredContent;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  sub_category: string;
  question_type: QuestionType;
  difficulty: number;
  text: string | StructuredContent;
  image_url: string | null;
  answers: Answer[];
  created_by: string;
  revision: number;
  created_at: string;
  updated_at: string;
  regulation_category?: RegulationCategory;
  hint?: string | StructuredContent | null;
}

export interface CreateQuestionDTO {
  category: QuestionCategory;
  sub_category: string;
  question_type: QuestionType;
  difficulty: number;
  text: string | StructuredContent;
  image_url?: string | null;
  answers: Answer[];
  created_by: string;
  regulation_category?: RegulationCategory;
  hint?: string | StructuredContent | null;
}

// New type for category progress tracking
export interface CategoryProgress {
  correct: number;
  total: number;
}
