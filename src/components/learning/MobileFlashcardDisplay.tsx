
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import UnifiedCard from '@/components/flashcard/unified/UnifiedCard';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';

interface MobileFlashcardDisplayProps {
  question: Question;
  onAnswer: (score: number) => void;
  regulationPreference: RegulationFilterType;
  className?: string;
}

export default function MobileFlashcardDisplay({ 
  question, 
  onAnswer,
  regulationPreference,
  className = '' 
}: MobileFlashcardDisplayProps) {
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
    onFlip: () => {},
    onAnswer,
    onNext: () => {}
  };

  return (
    <div className={`h-full w-full ${className}`}>
      <UnifiedCard
        key={question.id}
        config={cardConfig}
        handlers={cardHandlers}
        className="h-full w-full"
      />
    </div>
  );
}
