
import { Question, QuestionCategory } from '@/types/questions';

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

export interface SpacedRepetitionOptions {
  practiceMode?: boolean;
  regulationCategory?: string;
  boxNumber?: number;
  batchSize?: number;
  includeAllSubcategories?: boolean;
}

export interface SpacedRepetitionResult {
  loading: boolean;
  error: Error | null;
  dueQuestions: Question[];
  progress: UserProgress[] | null;
  submitAnswer: (questionId: string, score: number) => Promise<void>;
  pendingUpdatesCount: number;
  applyPendingUpdates: () => Promise<void>;
  reloadQuestions: () => Promise<void>;
}
