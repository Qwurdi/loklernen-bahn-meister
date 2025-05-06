
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SessionCompleteStateProps {
  correctCount: number;
  totalCards: number;
  onRestart: () => void;
  pendingUpdates?: boolean;
}

export default function SessionCompleteState({ 
  correctCount, 
  totalCards, 
  onRestart,
  pendingUpdates = false
}: SessionCompleteStateProps) {
  const percentage = Math.round((correctCount / totalCards) * 100);
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 space-y-8 text-center">
      <div className="rounded-full bg-green-100 p-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <h1 className="text-2xl font-bold">Lernsession abgeschlossen!</h1>
      
      <div className="w-full max-w-md space-y-2">
        <p className="text-lg font-medium">
          Du hast <span className="text-green-600 font-bold">{correctCount}</span> von {totalCards} Karten 
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
            onClick={onRestart} 
            className="w-full"
            disabled={pendingUpdates}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Neue Runde starten
          </Button>
          
          <p className="text-xs text-gray-500">
            Starte eine neue Lernsession mit denselben Karten oder kehre zurück zur Kartenübersicht.
          </p>
        </div>
      </div>
    </div>
  );
}
