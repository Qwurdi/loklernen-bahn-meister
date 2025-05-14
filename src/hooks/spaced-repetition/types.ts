
export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  box_number: number;
  last_score: number;
  last_reviewed_at: string;
  next_review_at: string;
  repetition_count: number;
  streak: number;
  correct_count: number;
  incorrect_count: number;
  ease_factor: number;
  interval_days: number;
  questions?: any;
  created_at: string;
  updated_at: string;
}

export interface SpacedRepetitionOptions {
  practiceMode?: boolean;
  regulationCategory?: string;
  boxNumber?: number;
  batchSize?: number;
  includeAllSubcategories?: boolean; // New option to load all subcategories for parent categories
}

export interface SpacedRepetitionResult {
  loading: boolean;
  error: Error | null;
  dueQuestions: any[];
  progress: UserProgress[];
  submitAnswer: (questionId: string, score: number) => Promise<void>;
  pendingUpdatesCount: number;
  applyPendingUpdates: () => Promise<void>;
  reloadQuestions: () => Promise<void>;
}
