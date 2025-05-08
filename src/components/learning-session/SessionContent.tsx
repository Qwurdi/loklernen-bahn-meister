import React from 'react';
import { AccessStatus } from '@/hooks/learning-session/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptySessionState from './EmptySessionState';
import SessionCompleteState from './SessionCompleteState';
import CardStackSession from './CardStackSession';

interface SessionContentProps {
  accessStatus: AccessStatus;
  loading: boolean;
  isEmpty: boolean;
  isComplete: boolean;
  categoryId?: string;
  subcategory?: string;
  totalQuestions: number;
  answeredCount: number;
  loadingMessage?: string;
  onNext: () => void;
  onComplete: () => void;
  onReset: () => void;
}

const SessionContent = ({
  accessStatus,
  loading,
  isEmpty,
  isComplete,
  categoryId,
  subcategory,
  totalQuestions,
  answeredCount,
  loadingMessage = 'Lade Karteikarten...',
  onNext,
  onComplete,
  onReset
}: SessionContentProps) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">{loadingMessage}</p>
      </div>
    );
  }

  // Access denied states
  if (accessStatus === 'pending') {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-medium text-yellow-800">Zugriff ausstehend</h2>
        <p className="mt-2 text-yellow-700">Diese Kategorie wird noch für das Lernen vorbereitet.</p>
      </div>
    );
  }

  if (accessStatus === 'not_found') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-medium text-red-800">Kategorie nicht gefunden</h2>
        <p className="mt-2 text-red-700">Die angeforderte Kategorie existiert nicht.</p>
      </div>
    );
  }

  if (accessStatus === 'denied_category') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-medium text-red-800">Zugriff verweigert</h2>
        <p className="mt-2 text-red-700">Sie haben keinen Zugriff auf diese Kategorie.</p>
      </div>
    );
  }

  if (accessStatus === 'denied_pro') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-medium text-red-800">Pro-Funktion</h2>
        <p className="mt-2 text-red-700">Diese Funktion erfordert ein Pro-Abonnement.</p>
      </div>
    );
  }

  if (accessStatus === 'no_selection') {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-medium text-blue-800">Keine Kategorie ausgewählt</h2>
        <p className="mt-2 text-blue-700">Bitte wählen Sie eine Kategorie zum Lernen aus.</p>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return <EmptySessionState categoryId={categoryId} subcategory={subcategory} />;
  }

  // Complete state
  if (isComplete) {
    return (
      <SessionCompleteState 
        correctCount={answeredCount} 
        totalCards={totalQuestions}
        totalQuestions={totalQuestions} 
        answeredCount={answeredCount}
        onReset={onReset} 
      />
    );
  }

  // Normal card stack view
  return (
    <CardStackSession
      onNext={onNext}
      onComplete={onComplete}
    />
  );
};

export default SessionContent;
