
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

interface LoadingStateProps {
  isMobile: boolean;
}

export function LoadingState({ isMobile }: LoadingStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-loklernen-ultramarine mx-auto mb-4"></div>
        <p className={isMobile ? 'text-white' : 'text-white'}>Lade Karteikarten...</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  isMobile: boolean;
  isPracticeMode: boolean;
  onNavigateBack: () => void;
}

export function EmptyState({ isMobile, isPracticeMode, onNavigateBack }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-6">
        <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-white' : 'text-white'}`}>
          Keine Karten verfügbar
        </h2>
        <p className="text-gray-400 mb-6">
          {isPracticeMode 
            ? "Melde dich an, um auf alle Karten zuzugreifen."
            : "Es sind keine fälligen Karten vorhanden."
          }
        </p>
        <button 
          onClick={onNavigateBack}
          className="bg-loklernen-ultramarine text-white px-6 py-2 rounded-lg hover:bg-loklernen-sapphire"
        >
          Zurück zu den Kategorien
        </button>
      </div>
    </div>
  );
}

interface CompletedStateProps {
  isMobile: boolean;
  correctCount: number;
  totalQuestions: number;
  onNavigateBack: () => void;
}

export function CompletedState({ isMobile, correctCount, totalQuestions, onNavigateBack }: CompletedStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-6">
        <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-white' : 'text-white'}`}>
          Session abgeschlossen!
        </h2>
        <p className="text-gray-400 mb-2">
          Du hast {correctCount} von {totalQuestions} Karten richtig beantwortet.
        </p>
        <p className="text-gray-400 mb-6">
          Gut gemacht! 🎉
        </p>
        <button 
          onClick={onNavigateBack}
          className="bg-loklernen-ultramarine text-white px-6 py-2 rounded-lg hover:bg-loklernen-sapphire"
        >
          Zurück zu den Kategorien
        </button>
      </div>
    </div>
  );
}
