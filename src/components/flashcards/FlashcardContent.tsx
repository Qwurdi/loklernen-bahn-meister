
import React from 'react';
import { Question } from "@/types/questions";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashcardContentProps {
  currentQuestion: Question;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  remainingToday: number;
  onAnswer: (score: number) => Promise<void>;
  onNext: () => void;
}

export default function FlashcardContent({
  currentQuestion,
  currentIndex,
  totalCards,
  correctCount,
  remainingToday,
  onAnswer,
  onNext
}: FlashcardContentProps) {
  const isMobile = useIsMobile();
  
  // Apply PWA-specific styles for mobile
  const containerClasses = isMobile 
    ? 'flex flex-col h-full w-full overflow-hidden' // Full height for PWA-like experience with no scrolling
    : 'space-y-6';
  
  return (
    <div className={containerClasses}>
      <FlashcardProgress 
        currentIndex={currentIndex}
        totalCards={totalCards}
        correctCount={correctCount}
        remainingToday={remainingToday}
      />
      
      <div className={isMobile ? 'flex-1 flex items-center justify-center overflow-hidden' : ''}>
        <FlashcardItem 
          question={currentQuestion} 
          onAnswer={onAnswer}
          onNext={onNext}
        />
      </div>
    </div>
  );
}
