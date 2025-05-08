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
  batchSize?: number; // Option to control batch size
}

export interface SpacedRepetitionResult {
  loading: boolean;
  error: Error | null;
  dueQuestions: Flashcard[]; // Geändert zu Flashcard[]
  progress: UserProgress[];
  submitAnswer: (questionId: number, score: number | boolean) => Promise<void>; // questionId zu number, score zu number | boolean (abhängig von userAnswer)
  pendingUpdatesCount: number;
  applyPendingUpdates: () => Promise<void>;
  reloadQuestions: () => Promise<void>;
  startNewSession: (type: SessionType, category?: string, regulation?: string, cardIdsToLoad?: number[]) => Promise<void>; // Hinzugefügt
  incorrectCardIdsInCurrentSession: number[]; // Hinzugefügt
}

export interface BoxStats {
  boxNumber: number;
  total: number;
  due: number;
  regulationCategory?: string; // Added for regulation-specific stats
}

// Definition für Flashcard (kann identisch zu Question sein oder spezifische Felder haben)
// Wenn Question bereits alle nötigen Felder für eine Flashcard enthält, kann man auch Question verwenden.
// Für dieses Beispiel nehmen wir an, Flashcard ist ein Alias oder eine Erweiterung von Question.
export type Flashcard = Question & {
  // Zusätzliche Felder spezifisch für die Darstellung als Flashcard, falls vorhanden
  transformedContent?: any; // Beispiel
};

// Definition für SessionType
export type SessionType = 'due' | 'category' | 'all' | 'guest' | 'specific_ids';

export interface LearningBoxOptions {
  userId: string;
  regulationCategory?: string;
  includeCompleted?: boolean;
}

export interface SessionPreferences {
  practiceMode: boolean;
  regulationCategory: string;
  batchSize: number;
  selectedCategories?: string[];
}
