
import React, { memo } from "react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashcardProgressProps {
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  remainingToday: number;
}

const FlashcardProgress = memo(function FlashcardProgress({
  currentIndex,
  totalCards,
  correctCount,
  remainingToday
}: FlashcardProgressProps) {
  const isMobile = useIsMobile();
  const progressPercentage = totalCards > 0 ? Math.round(((currentIndex) / totalCards) * 100) : 0;
  const correctPercentage = totalCards > 0 ? Math.round((correctCount / Math.max(1, currentIndex)) * 100) : 0;

  if (isMobile) {
    // Super compact mobile view optimized for PWA experience
    return (
      <div className="px-1 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-loklernen-sapphire flex items-center justify-center text-white font-medium text-xs">
              {currentIndex + 1}
            </div>
            <span className="text-xs text-gray-400">/{totalCards}</span>
          </div>
          <div className="text-xs py-0.5 px-2 bg-gray-800 rounded-full text-gray-300 border border-gray-700">
            {remainingToday} übrig
          </div>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-1" 
          indicatorClassName={
            correctPercentage > 70 ? "bg-green-500" : 
            correctPercentage > 40 ? "bg-yellow-500" : 
            "bg-red-500"
          }
        />
      </div>
    );
  }

  // Desktop view remains more detailed but without percentage displays
  return (
    <div className="mb-6 rounded-lg border border-gray-800 p-4 bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Fortschritt</p>
          <div className="flex items-center gap-2">
            <Progress value={progressPercentage} className="h-2" />
            {/* Percentage removed */}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Karte {currentIndex + 1} von {totalCards}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Erfolgsquote</p>
          <div className="flex items-center gap-2">
            <Progress 
              value={correctPercentage} 
              className="h-2" 
              indicatorClassName={correctPercentage > 70 ? "bg-green-500" : correctPercentage > 40 ? "bg-yellow-500" : "bg-red-500"}
            />
            {/* Percentage removed */}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {correctCount} richtig beantwortet
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Heute noch fällig</p>
          <div className="text-2xl font-bold">{remainingToday}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Karten zum Wiederholen
          </p>
        </div>
      </div>
    </div>
  );
});

export default FlashcardProgress;
