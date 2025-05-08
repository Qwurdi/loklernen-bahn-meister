
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SessionCompleteStateProps {
  correctCount: number;
  totalCards: number;
  totalQuestions: number; // Added to match usage in SessionContent
  answeredCount: number; // Added to match usage in SessionContent
  onReset: () => void;
  onRestartIncorrect?: (cardIds: number[]) => void;
  incorrectCardIds?: number[];
  pendingUpdates?: boolean;
}

export default function SessionCompleteState({ 
  correctCount, 
  totalCards, 
  totalQuestions, 
  answeredCount,
  onReset,
  onRestartIncorrect,
  incorrectCardIds,
  pendingUpdates = false
}: SessionCompleteStateProps) {
  // Use totalQuestions and answeredCount if provided, otherwise fallback to totalCards and correctCount
  const displayTotal = totalQuestions || totalCards;
  const displayCorrect = answeredCount || correctCount;
  
  const percentage = Math.round((displayCorrect / displayTotal) * 100) || 0;
  const hasIncorrectCards = incorrectCardIds && incorrectCardIds.length > 0;
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 space-y-8 text-center">
      <div className="rounded-full bg-green-100 p-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <h1 className="text-2xl font-bold">Lernsession abgeschlossen!</h1>
      
      <div className="w-full max-w-md space-y-2">
        <p className="text-lg font-medium">
          Du hast <span className="text-green-600 font-bold">{displayCorrect}</span> von {displayTotal} Karten 
          richtig beantwortet.
        </p>
        <Progress value={percentage} className="h-2" />
        <p className="text-sm text-gray-500">{percentage}% richtig</p>
      </div>
      
      <div className="text-center space-y-4 w-full max-w-md">
        {pendingUpdates && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
            Dein Lernfortschritt wird im Hintergrund gespeichert...
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            onClick={onReset} 
            className="w-full"
            disabled={pendingUpdates}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Neue Runde starten
          </Button>

          {hasIncorrectCards && onRestartIncorrect && (
            <Button 
              onClick={() => onRestartIncorrect(incorrectCardIds!)} 
              className="w-full mt-2"
              variant="outline"
              disabled={pendingUpdates}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Fehler wiederholen ({incorrectCardIds!.length})
            </Button>
          )}
          
          <p className="text-xs text-gray-500">
            Starte eine neue Lernsession oder wiederhole die falsch beantworteten Karten.
          </p>
        </div>
      </div>
    </div>
  );
}
