
import React, { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Question } from "@/types/questions";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import FlashcardHeader from "@/components/flashcards/FlashcardHeader";
import CardStack from "@/components/flashcards/stack/CardStack";
import { RegulationFilterType } from "@/types/regulation";

interface FlashcardSessionProps {
  questions: Question[];
  subcategory?: string;
  isPracticeMode: boolean;
  onRegulationChange: (value: RegulationFilterType) => void;
  handleAnswer: (questionId: string, score: number) => Promise<void>;
  handleComplete: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function FlashcardSession({
  questions,
  subcategory,
  isPracticeMode,
  onRegulationChange,
  handleAnswer,
  handleComplete,
  currentIndex,
  setCurrentIndex
}: FlashcardSessionProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-black text-white`}>
      <Navbar />
      
      <main className="flex-1">
        <div className={`${isMobile ? 'px-0 pt-0 pb-16 h-full' : 'container px-4 py-6'}`}>
          <FlashcardHeader 
            subcategory={subcategory}
            isPracticeMode={isPracticeMode}
            onRegulationChange={onRegulationChange}
          />
          
          {/* Card Stack */}
          <div className="h-full pt-2">
            <CardStack 
              questions={questions}
              onAnswer={handleAnswer}
              onComplete={handleComplete}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
