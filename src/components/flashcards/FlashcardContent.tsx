
import React from 'react';
import { Question } from "@/types/questions";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";

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
  return (
    <div className="space-y-6">
      <FlashcardItem 
        question={currentQuestion} 
        onAnswer={onAnswer}
        onNext={onNext}
      />
      
      <FlashcardProgress 
        currentIndex={currentIndex}
        totalCards={totalCards}
        correctCount={correctCount}
        remainingToday={remainingToday}
      />
    </div>
  );
}
