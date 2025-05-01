
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
  
  return (
    <div className={`space-y-${isMobile ? '2' : '6'}`}>
      {!isMobile && (
        <FlashcardProgress 
          currentIndex={currentIndex}
          totalCards={totalCards}
          correctCount={correctCount}
          remainingToday={remainingToday}
        />
      )}
      
      {isMobile && (
        <FlashcardProgress 
          currentIndex={currentIndex}
          totalCards={totalCards}
          correctCount={correctCount}
          remainingToday={remainingToday}
        />
      )}
      
      <FlashcardItem 
        question={currentQuestion} 
        onAnswer={onAnswer}
        onNext={onNext}
      />
    </div>
  );
}
