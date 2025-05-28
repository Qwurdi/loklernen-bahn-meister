
import React from 'react';
import { Question } from "@/types/questions";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import UnifiedCard from '@/components/flashcard/unified/UnifiedCard';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';

interface MobileFlashcardProps {
  question: Question;
  isFlipped: boolean;
  isAnswered: boolean;
  onShowAnswer: () => void;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function MobileFlashcard({
  question,
  isFlipped,
  isAnswered,
  onShowAnswer,
  onKnown,
  onNotKnown
}: MobileFlashcardProps) {
  const { regulationPreference } = useUserPreferences();

  const cardConfig: CardConfig = {
    question,
    regulationPreference,
    displayMode: 'single',
    interactionMode: 'swipe',
    enableSwipe: true,
    enableKeyboard: false,
    showHints: true,
    autoFlip: false
  };

  const cardHandlers: CardEventHandlers = {
    onFlip: onShowAnswer,
    onAnswer: (score: number) => {
      score >= 4 ? onKnown() : onNotKnown();
    },
    onNext: () => {}
  };

  return (
    <div className="w-full h-full px-3 touch-none">
      <UnifiedCard
        config={cardConfig}
        handlers={cardHandlers}
        className="w-full h-full min-h-[500px]"
      />
    </div>
  );
}
