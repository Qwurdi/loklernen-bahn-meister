
import React, { useState } from 'react';
import { Question } from "@/types/questions";
import { RegulationFilterType } from "@/types/regulation";
import MobileFlashcard from "./MobileFlashcard";
import MiniProgressIndicator from "./MiniProgressIndicator";

interface MobileFlashcardContentProps {
  currentQuestion: Question;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  remainingToday: number;
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onNext: () => void;
  subCategoryTitle: string;
  regulationFilter: RegulationFilterType;
  onRegulationChange: (value: RegulationFilterType) => void;
}

export default function MobileFlashcardContent({
  currentQuestion,
  currentIndex,
  totalCards,
  correctCount,
  remainingToday,
  onAnswer,
  onNext,
  subCategoryTitle
}: MobileFlashcardContentProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const handleShowAnswer = () => {
    setIsFlipped(true);
  };
  
  const handleAnswer = async (score: number) => {
    setIsAnswered(true);
    await onAnswer(currentQuestion.id, score);
    
    // Short delay before moving to next card
    setTimeout(() => {
      setIsFlipped(false);
      setIsAnswered(false);
      onNext();
    }, 300);
  };
  
  return (
    <div className="h-full w-full flex flex-col">
      {/* Mini progress indicators positioned at top */}
      <MiniProgressIndicator 
        currentIndex={currentIndex}
        totalCards={totalCards}
        correctCount={correctCount}
        remainingToday={remainingToday}
      />
      
      {/* Flashcard takes full remaining space */}
      <div className="flex-1 flex items-center justify-center h-full">
        <MobileFlashcard
          question={currentQuestion}
          isFlipped={isFlipped}
          isAnswered={isAnswered}
          onShowAnswer={handleShowAnswer}
          onKnown={() => handleAnswer(5)}
          onNotKnown={() => handleAnswer(1)}
        />
      </div>
    </div>
  );
}
