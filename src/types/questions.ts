
import { Json } from "@/integrations/supabase/types";

export type QuestionCategory = 'Signale' | 'Betriebsdienst';
export type QuestionType = 'MC_single' | 'MC_multi' | 'open';
export type RegulationCategory = 'DS 301' | 'DV 301' | 'both';

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  sub_category: string;
  question_type: QuestionType;
  difficulty: number;
  text: string;
  image_url: string | null;
  answers: Answer[];
  created_by: string;
  revision: number;
  created_at: string;
  updated_at: string;
  regulation_category?: RegulationCategory;
}

export interface CreateQuestionDTO {
  category: QuestionCategory;
  sub_category: string;
  question_type: QuestionType;
  difficulty: number;
  text: string;
  image_url?: string | null;
  answers: Answer[];
  created_by: string;
  regulation_category?: RegulationCategory;
}
