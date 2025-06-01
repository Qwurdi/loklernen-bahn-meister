
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';

export type InteractionMode = 'swipe' | 'keyboard' | 'tap' | 'buttons';
export type DisplayMode = 'single' | 'stack' | 'grid';

export interface FlashcardState {
  isFlipped: boolean;
  isAnswered: boolean;
  isAnimating: boolean;
  swipeEnabled: boolean;
  swipeDirection?: 'left' | 'right' | null;
}

export interface AnswerFeedback {
  score: number;
  isCorrect: boolean;
  timestamp: number;
  responseTime?: number;
}

export interface CardConfig {
  question: Question;
  regulationPreference: RegulationFilterType;
  displayMode: DisplayMode;
  interactionMode: InteractionMode;
  enableSwipe: boolean;
  enableKeyboard: boolean;
  showHints: boolean;
  autoFlip: boolean;
}

export interface CardEventHandlers {
  onFlip: () => void;
  onAnswer: (score: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface SessionConfig {
  questions: Question[];
  sessionType: 'practice' | 'review' | 'exam';
  regulationPreference: RegulationFilterType;
  adaptiveDifficulty: boolean;
  interactionMode: InteractionMode;
}

export interface SessionStats {
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  averageConfidence: number;
  timeSpent: number;
  sessionStartTime: number;
}
