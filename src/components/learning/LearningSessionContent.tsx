
import React from 'react';
import { Question } from "@/types/questions";
import { SessionOptions } from "@/types/spaced-repetition";
import { RegulationFilterType } from "@/types/regulation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import MobileFlashcardDisplay from "@/components/learning/MobileFlashcardDisplay";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";

interface LearningSessionContentProps {
  currentQuestion: Question;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  sessionTitle: string;
  sessionOptions: SessionOptions;
  onAnswer: (score: number) => Promise<void>;
  onRegulationChange: (value: RegulationFilterType) => void;
  isMobile: boolean;
}

export default function LearningSessionContent({
  currentQuestion,
  currentIndex,
  totalCards,
  correctCount,
  sessionTitle,
  sessionOptions,
  onAnswer,
  onRegulationChange,
  isMobile
}: LearningSessionContentProps) {
  const isPracticeMode = sessionOptions.mode === 'practice';

  // Handle answer with proper async flow
  const handleAnswer = async (score: number) => {
    await onAnswer(score);
  };

  if (isMobile) {
    return (
      <div className="h-full">
        <MobileFlashcardDisplay
          key={`${currentQuestion.id}-${currentIndex}`} // Ensure clean state on question change
          question={currentQuestion}
          onAnswer={handleAnswer}
          className="h-full"
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link to="/karteikarten">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2">Zurück</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold ml-2 text-white">{sessionTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm px-2 py-1 rounded bg-blue-900/40 text-blue-200 border border-blue-800/50">
            {isPracticeMode ? "Übungsmodus" : "Wiederholungsmodus"}
          </span>
        </div>
      </div>
      
      {/* Regulation filter */}
      <div className="mb-4">
        <RegulationFilterToggle
          value={sessionOptions.regulation || 'all'}
          onChange={onRegulationChange}
          variant="outline"
          size="sm"
          className="mb-4 border-gray-700 bg-gray-800/50 text-gray-200"
        />
      </div>
      
      {/* Content */}
      <div className="space-y-6 pt-2">
        <FlashcardProgress 
          currentIndex={currentIndex}
          totalCards={totalCards}
          correctCount={correctCount}
          remainingToday={totalCards}
        />
        
        <FlashcardItem 
          key={`desktop-${currentQuestion.id}-${currentIndex}`} // Ensure clean state
          question={currentQuestion} 
          onAnswer={handleAnswer}
          onNext={() => {}} // Handled by parent
        />
      </div>
    </>
  );
}
