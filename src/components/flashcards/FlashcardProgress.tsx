
import React from "react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashcardProgressProps {
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  remainingToday: number;
}

export default function FlashcardProgress({
  currentIndex,
  totalCards,
  correctCount,
  remainingToday
}: FlashcardProgressProps) {
  const isMobile = useIsMobile();
  const progressPercentage = totalCards > 0 ? Math.round(((currentIndex) / totalCards) * 100) : 0;
  const correctPercentage = totalCards > 0 ? Math.round((correctCount / Math.max(1, currentIndex)) * 100) : 0;

  if (isMobile) {
    // Compact mobile view
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>{currentIndex + 1}/{totalCards}</span>
          <span>{correctPercentage}% richtig</span>
          <span>Heute: {remainingToday} fällig</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-1.5" 
          indicatorClassName={correctPercentage > 70 ? "bg-green-500" : correctPercentage > 40 ? "bg-yellow-500" : "bg-red-500"}
        />
      </div>
    );
  }

  // Desktop view remains more detailed
  return (
    <div className="mb-6 bg-card rounded-lg border p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Fortschritt</p>
          <div className="flex items-center gap-2">
            <Progress value={progressPercentage} className="h-2" />
            <span className="text-xs font-medium">{progressPercentage}%</span>
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
            <span className="text-xs font-medium">{correctPercentage}%</span>
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
}
