
import React from 'react';
import { Question } from "@/types/questions";
import { useIsMobile } from "@/hooks/use-mobile";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";
import FlashcardHeader from "@/components/flashcards/FlashcardHeader";
import { ChevronLeft } from "lucide-react";
import { RegulationFilterType } from "@/types/regulation";

interface FlashcardPageContentProps {
  currentQuestion: Question;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  remainingToday: number;
  sessionTitle: string;
  isPracticeMode: boolean;
  regulationFilter: RegulationFilterType;
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onNext: () => void;
  onRegulationChange: (value: RegulationFilterType) => void;
  onNavigateBack: () => void;
}

export default function FlashcardPageContent({
  currentQuestion,
  currentIndex,
  totalCards,
  correctCount,
  remainingToday,
  sessionTitle,
  isPracticeMode,
  regulationFilter,
  onAnswer,
  onNext,
  onRegulationChange,
  onNavigateBack
}: FlashcardPageContentProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        {/* Header */}
        <div className="absolute top-2 left-2 z-10">
          <button 
            onClick={onNavigateBack}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
          <div 
            className="h-full bg-gradient-ultramarine gradient-shift"
            style={{ width: `${((currentIndex) / totalCards) * 100}%` }}
          ></div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 relative pt-12">
          <div className="h-full flex flex-col">
            <FlashcardProgress 
              currentIndex={currentIndex}
              totalCards={totalCards}
              correctCount={correctCount}
              remainingToday={remainingToday}
            />
            
            <div className="flex-1 flex items-center justify-center">
              <FlashcardItem 
                question={currentQuestion} 
                onAnswer={(score) => onAnswer(currentQuestion.id, score)}
                onNext={onNext}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop layout
  return (
    <main className="flex-1">
      <div className="container px-4 py-6">
        <FlashcardHeader 
          subcategory={sessionTitle}
          isPracticeMode={isPracticeMode}
          regulationFilter={regulationFilter}
          onRegulationChange={onRegulationChange}
        />
        
        <div className="space-y-6 pt-2">
          <FlashcardProgress 
            currentIndex={currentIndex}
            totalCards={totalCards}
            correctCount={correctCount}
            remainingToday={remainingToday}
          />
          
          <FlashcardItem 
            question={currentQuestion} 
            onAnswer={(score) => onAnswer(currentQuestion.id, score)}
            onNext={onNext}
          />
        </div>
      </div>
    </main>
  );
}
