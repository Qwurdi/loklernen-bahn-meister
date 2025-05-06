
import { Question, QuestionCategory } from '@/types/questions';

export interface UserProgress {
  id: string;
  question_id: string;
  last_reviewed_at: string;
  next_review_at: string;
  ease_factor: number;
  interval_days: number;
  repetition_count: number;
  correct_count: number;
  incorrect_count: number;
  last_score: number;
  box_number: number;
  streak: number;
}

export interface SpacedRepetitionOptions {
  practiceMode?: boolean;
  regulationCategory?: string;
  boxNumber?: number;
  batchSize?: number;
  selectedCategories?: string[];
}

export interface SpacedRepetitionResult {
  loading: boolean;
  error: Error | null;
  dueQuestions: Question[];
  progress: UserProgress[];
  submitAnswer: (questionId: string, score: number) => Promise<void>;
  pendingUpdatesCount: number;
  applyPendingUpdates: () => Promise<void>;
  reloadQuestions: () => Promise<void>;
  isMounted?: React.MutableRefObject<boolean>;
  cleanupQuestions?: () => void;
}

export interface BoxStats {
  boxNumber: number;
  total: number;
  due: number;
}
