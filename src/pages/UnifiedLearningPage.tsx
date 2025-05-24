
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUnifiedSession } from '@/hooks/learning-session/useUnifiedSession';
import MobileFlashcardDisplay from '@/components/learning/MobileFlashcardDisplay';
import SessionComplete from '@/components/learning/SessionComplete';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UnifiedSessionHeader from '@/components/learning-session/UnifiedSessionHeader';
import { toast } from 'sonner';

export default function UnifiedLearningPage() {
  const isMobile = useIsMobile();
  const {
    loading,
    error,
    sessionState,
    params,
    currentQuestion,
    submitAnswer,
    nextQuestion,
    resetSession,
    updateParams
  } = useUnifiedSession();

  // Lock viewport for mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('overflow-hidden');
      document.documentElement.style.height = '100%';
      
      return () => {
        document.body.classList.remove('overflow-hidden');
        document.documentElement.style.height = '';
      };
    }
  }, [isMobile]);

  const handleAnswer = async (score: number) => {
    if (!currentQuestion) return;
    
    await submitAnswer(currentQuestion.id, score);
    
    // Short delay for visual feedback
    setTimeout(() => {
      nextQuestion();
    }, 300);
  };

  const handleRestart = () => {
    resetSession();
  };

  const handleGoHome = () => {
    window.location.href = '/karteikarten';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Lade Lernkarten...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-bold">Fehler</h2>
            <p className="mt-2">{error.message}</p>
          </div>
          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  // Session complete state
  if (sessionState.completed && sessionState.progress) {
    return (
      <SessionComplete
        correctCount={sessionState.progress.correct}
        totalQuestions={sessionState.progress.total}
        onRestart={handleRestart}
        onHome={handleGoHome}
      />
    );
  }

  // No questions state
  if (!sessionState.questions.length || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Keine Karten verfügbar
          </h2>
          <p className="text-gray-600 mb-6">
            Es sind keine Lernkarten für die ausgewählten Kriterien verfügbar.
          </p>
          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  const sessionTitle = params.subcategory || params.category || 'Lerneinheit';

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
        {/* Ultra-thin progress bar */}
        {sessionState.progress && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 z-20">
            <div 
              className="h-full bg-gradient-to-r from-loklernen-ultramarine to-blue-600 transition-all duration-300"
              style={{ width: `${sessionState.progress.percentage}%` }}
            />
          </div>
        )}

        <UnifiedSessionHeader
          sessionTitle={sessionTitle}
          isMobile={true}
        />

        {/* Progress info */}
        {sessionState.progress && (
          <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-gray-700">
            {sessionState.progress.current}/{sessionState.progress.total}
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 p-4">
          <MobileFlashcardDisplay
            question={currentQuestion}
            onAnswer={handleAnswer}
            className="h-full"
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <UnifiedSessionHeader
          sessionTitle={sessionTitle}
          isMobile={false}
        />
        
        {/* Progress */}
        {sessionState.progress && (
          <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Fortschritt</span>
              <span className="text-sm font-medium">
                {sessionState.progress.current}/{sessionState.progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-loklernen-ultramarine to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${sessionState.progress.percentage}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Flashcard */}
        <div className="h-96">
          <MobileFlashcardDisplay
            question={currentQuestion}
            onAnswer={handleAnswer}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
