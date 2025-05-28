
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import { SessionOptions } from '@/types/spaced-repetition';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnifiedCard from '@/components/flashcard/unified/UnifiedCard';
import EnhancedCardStack from '@/components/flashcard/stack/EnhancedCardStack';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';

interface EnhancedLearningSessionProps {
  currentQuestion: Question;
  questions: Question[];
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  sessionTitle: string;
  sessionOptions: SessionOptions;
  regulationPreference: RegulationFilterType;
  onAnswer: (score: number) => Promise<void>;
  onNext?: () => void;
  onGoHome?: () => void;
  setCurrentIndex: (index: number) => void;
}

export default function EnhancedLearningSession({
  currentQuestion,
  questions,
  currentIndex,
  totalCards,
  correctCount,
  sessionTitle,
  sessionOptions,
  regulationPreference,
  onAnswer,
  onNext,
  onGoHome,
  setCurrentIndex
}: EnhancedLearningSessionProps) {
  const isMobile = useIsMobile();

  const handleStackAnswer = async (questionId: string, score: number) => {
    await onAnswer(score);
  };

  const handleStackComplete = () => {
    // Session completed, could trigger completion flow
    onNext?.();
  };

  // Mobile stack-based experience
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header with back button */}
        {onGoHome && (
          <div className="absolute top-4 left-4 z-30">
            <Button
              onClick={onGoHome}
              variant="ghost"
              size="sm"
              className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-lg shadow-lg border border-white/20 hover:scale-105 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Session title */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg border border-white/20">
            <h2 className="text-sm font-medium text-gray-800">{sessionTitle}</h2>
          </div>
        </div>

        {/* Enhanced card stack */}
        <EnhancedCardStack
          questions={questions}
          onAnswer={handleStackAnswer}
          onComplete={handleStackComplete}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          className="h-full"
        />
      </div>
    );
  }

  // Desktop single-card experience
  const cardConfig: CardConfig = {
    question: currentQuestion,
    regulationPreference,
    displayMode: 'single',
    interactionMode: 'keyboard',
    enableSwipe: false,
    enableKeyboard: true,
    showHints: true,
    autoFlip: false
  };

  const cardHandlers: CardEventHandlers = {
    onFlip: () => {},
    onAnswer: async (score: number) => {
      await onAnswer(score);
      setTimeout(() => {
        onNext?.();
      }, 300);
    },
    onNext: onNext || (() => {})
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{sessionTitle}</h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
            <span>Karte {currentIndex + 1} von {totalCards}</span>
            <span>•</span>
            <span>{correctCount} richtig</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-inner"
              style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <UnifiedCard
          config={cardConfig}
          handlers={cardHandlers}
          className="mx-auto max-w-md shadow-2xl"
        />

        {/* Keyboard hints */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 text-xs text-gray-500 bg-white/50 rounded-full px-4 py-2">
            <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Leertaste</kbd> Antwort zeigen</span>
            <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">←</kbd> Nein</span>
            <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">→</kbd> Ja</span>
          </div>
        </div>
      </div>
    </div>
  );
}
