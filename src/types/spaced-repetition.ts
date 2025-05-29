
import { Question } from '@/types/questions';

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  last_score: number;
  box_number: number;
  last_reviewed_at: string;
  next_review_at: string;
  ease_factor: number;
  interval_days: number;
  repetition_count: number;
  correct_count: number;
  incorrect_count: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface SessionQuestion {
  question: Question;
  progress?: UserProgress;
}

export interface SessionOptions {
  category?: 'Signale' | 'Betriebsdienst';
  subcategory?: string;
  regulation?: 'DS 301' | 'DV 301' | 'both' | 'all';
  mode?: 'review' | 'practice' | 'boxes';
  boxNumber?: number;
  batchSize?: number;
  includeAllSubcategories?: boolean;
}

export interface SessionProgress {
  totalQuestions: number;
  currentQuestion: number;
  correctAnswers: number;
  answeredQuestions: number;
  percentage: number;
}

export interface SpacedRepetitionState {
  questions: SessionQuestion[];
  loading: boolean;
  error: Error | null;
  progress: SessionProgress;
}

export interface SpacedRepetitionActions {
  submitAnswer: (questionId: string, score: number) => Promise<void>;
  loadQuestions: (options: SessionOptions) => Promise<void>;
  reset: () => void;
}

export interface SpacedRepetitionHook extends SpacedRepetitionState, SpacedRepetitionActions {}
