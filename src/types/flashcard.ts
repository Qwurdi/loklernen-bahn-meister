
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';

// Core flashcard state management
export interface FlashcardState {
  isFlipped: boolean;
  isAnswered: boolean;
  isAnimating: boolean;
  swipeEnabled: boolean;
}

// Interaction modes
export type InteractionMode = 'tap' | 'swipe' | 'buttons' | 'keyboard';

// Card display modes
export type CardDisplayMode = 'single' | 'stack' | 'preview';

// Answer feedback types
export interface AnswerFeedback {
  score: number;
  isCorrect: boolean;
  timestamp: number;
}

// Unified card configuration
export interface CardConfig {
  question: Question;
  regulationPreference: RegulationFilterType;
  displayMode: CardDisplayMode;
  interactionMode: InteractionMode;
  enableSwipe: boolean;
  enableKeyboard: boolean;
  showHints: boolean;
  autoFlip: boolean;
}

// Card event handlers
export interface CardEventHandlers {
  onFlip: () => void;
  onAnswer: (score: number) => void;
  onNext: () => void;
  onPrevious?: () => void;
  onHint?: () => void;
}

// Animation configuration
export interface AnimationConfig {
  flipDuration: number;
  swipeThreshold: number;
  springConfig: {
    tension: number;
    friction: number;
  };
}

// Default configurations
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  flipDuration: 600,
  swipeThreshold: 100,
  springConfig: {
    tension: 300,
    friction: 30
  }
};

export const DEFAULT_CARD_CONFIG: Partial<CardConfig> = {
  displayMode: 'single',
  interactionMode: 'tap',
  enableSwipe: true,
  enableKeyboard: true,
  showHints: true,
  autoFlip: false
};
