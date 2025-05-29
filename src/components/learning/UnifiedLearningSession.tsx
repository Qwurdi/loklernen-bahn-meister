
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import { SessionOptions } from '@/types/spaced-repetition';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';
import { useIsMobile } from '@/hooks/use-mobile';
import UnifiedCard from '@/components/flashcard/unified/UnifiedCard';

interface UnifiedLearningSessionProps {
  currentQuestion: Question;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  sessionTitle: string;
  sessionOptions: SessionOptions;
  regulationPreference: RegulationFilterType;
  onAnswer: (score: number) => Promise<void>;
  onNext?: () => void;
}

export default function UnifiedLearningSession({
  currentQuestion,
  currentIndex,
  totalCards,
  correctCount,
  sessionTitle,
  sessionOptions,
  regulationPreference,
  onAnswer,
  onNext
}: UnifiedLearningSessionProps) {
  const isMobile = useIsMobile();

  const cardConfig: CardConfig = {
    question: currentQuestion,
    regulationPreference,
    displayMode: 'single',
    interactionMode: isMobile ? 'swipe' : 'keyboard',
    enableSwipe: isMobile,
    enableKeyboard: !isMobile,
    showHints: true,
    autoFlip: false
  };

  const cardHandlers: CardEventHandlers = {
    onFlip: () => {
      // Optional: Track flip events
    },
    onAnswer: async (score: number) => {
      await onAnswer(score);
      setTimeout(() => {
        onNext?.();
      }, 300);
    },
    onNext: onNext || (() => {})
  };

  if (isMobile) {
    return (
      <div className="h-full w-full p-4">
        <UnifiedCard
          config={cardConfig}
          handlers={cardHandlers}
          className="h-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{sessionTitle}</h2>
          <div className="text-sm text-gray-600">
            Karte {currentIndex + 1} von {totalCards} • {correctCount} richtig
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
            />
          </div>
        </div>

        <UnifiedCard
          config={cardConfig}
          handlers={cardHandlers}
        />
      </div>
    </div>
  );
}
