
import React from 'react';
import { Question } from '@/types/questions';
import { SessionOptions } from '@/types/spaced-repetition';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import MobileFlashcardDisplay from './MobileFlashcardDisplay';
import ModernLearningSession from './ModernLearningSession';

interface LearningSessionContentProps {
  currentQuestion: Question;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  sessionTitle: string;
  sessionOptions: SessionOptions;
  onAnswer: (score: number) => Promise<void>;
}

export default function LearningSessionContent({
  currentQuestion,
  currentIndex,
  totalCards,
  correctCount,
  sessionTitle,
  sessionOptions,
  onAnswer
}: LearningSessionContentProps) {
  const isMobile = useIsMobile();
  const { regulationPreference } = useUserPreferences();

  if (isMobile) {
    return (
      <div className="h-full w-full">
        <MobileFlashcardDisplay
          key={`mobile-${currentQuestion.id}-${currentIndex}`}
          question={currentQuestion}
          onAnswer={onAnswer}
          regulationPreference={regulationPreference}
          className="h-full"
        />
      </div>
    );
  }

  return (
    <ModernLearningSession
      currentQuestion={currentQuestion}
      currentIndex={currentIndex}
      totalCards={totalCards}
      correctCount={correctCount}
      sessionTitle={sessionTitle}
      sessionOptions={sessionOptions}
      onAnswer={onAnswer}
      isMobile={isMobile}
    />
  );
}
