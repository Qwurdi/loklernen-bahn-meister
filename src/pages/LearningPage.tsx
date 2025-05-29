
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLearningSession } from '@/hooks/learning-session';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { ChevronLeft } from 'lucide-react';
import EnhancedLearningSession from '@/components/learning/EnhancedLearningSession';
import SessionComplete from '@/components/learning/SessionComplete';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function LearningPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { regulationPreference } = useUserPreferences();
  
  const {
    loading,
    error,
    canAccess,
    categoryRequiresAuth,
    questions,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    sessionTitle,
    sessionOptions,
    handleAnswer,
    handleComplete,
    handleRestart
  } = useLearningSession();

  // Lock viewport for mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('flashcard-mode');
      document.documentElement.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.classList.remove('flashcard-mode');
        document.documentElement.style.height = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isMobile]);

  const handleAnswerAndNext = async (score: number) => {
    if (!questions[currentIndex]) return;
    
    await handleAnswer(questions[currentIndex].id, score);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleComplete();
      }
    }, 300);
  };

  const handleGoHome = () => {
    navigate('/karteikarten');
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Lade Lernkarten...</p>
        </div>
      </div>
    );
  }

  // Handle access control
  if (!canAccess) {
    if (categoryRequiresAuth) {
      return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Anmeldung erforderlich</h2>
            <p className="text-gray-600 mb-6">Für diese Kategorie musst du angemeldet sein.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              Anmelden
            </button>
          </div>
        </div>
      );
    }
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
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
  if (sessionFinished) {
    return (
      <SessionComplete
        correctCount={correctCount}
        totalQuestions={questions.length}
        onRestart={handleRestart}
        onHome={handleGoHome}
      />
    );
  }

  // No questions state
  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
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

  // Main learning session
  return (
    <EnhancedLearningSession
      currentQuestion={questions[currentIndex]}
      questions={questions}
      currentIndex={currentIndex}
      totalCards={questions.length}
      correctCount={correctCount}
      sessionTitle={sessionTitle}
      sessionOptions={sessionOptions}
      regulationPreference={regulationPreference}
      onAnswer={handleAnswerAndNext}
      onNext={() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          handleComplete();
        }
      }}
      onGoHome={handleGoHome}
      setCurrentIndex={setCurrentIndex}
    />
  );
}
