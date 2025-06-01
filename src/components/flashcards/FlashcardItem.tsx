
import React, { memo } from "react";
import { Question } from "@/types/questions";
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useIsMobile } from "@/hooks/use-mobile";
import { UnifiedCard } from '@/components/flashcard/unified/UnifiedCard';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';

interface FlashcardItemProps {
  question: Question;
  onAnswer: (score: number) => void;
  onNext: () => void;
  showAnswer?: boolean;
}

const FlashcardItem = memo(function FlashcardItem({ 
  question, 
  onAnswer, 
  onNext,
  showAnswer = false
}: FlashcardItemProps) {
  const { regulationPreference } = useUserPreferences();
  const isMobile = useIsMobile();

  const cardConfig: CardConfig = {
    question,
    regulationPreference,
    displayMode: 'single',
    interactionMode: isMobile ? 'swipe' : 'keyboard',
    enableSwipe: isMobile,
    enableKeyboard: !isMobile,
    showHints: true,
    autoFlip: showAnswer
  };

  const cardHandlers: CardEventHandlers = {
    onFlip: () => {},
    onAnswer: (score: number) => {
      onAnswer(score);
      setTimeout(() => {
        onNext();
      }, 300);
    },
    onNext
  };

  return (
    <div className={isMobile ? "h-full w-full px-3 touch-none" : "mx-auto max-w-md"}>
      <UnifiedCard
        config={cardConfig}
        handlers={cardHandlers}
        className={`relative ${isMobile ? 'w-full h-full min-h-[500px]' : 'max-w-md mx-auto min-h-[500px]'}`}
      />
    </div>
  );
});

export default FlashcardItem;
