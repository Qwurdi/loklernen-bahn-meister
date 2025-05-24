
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLearningSession } from "@/hooks/learning-session/useLearningSession";
import { RegulationFilterType } from "@/types/regulation";
import MobileFlashcardContent from "./MobileFlashcardContent";
import MobileSessionComplete from "./MobileSessionComplete";
import MobileEmptyState from "./MobileEmptyState";
import MobileLoadingState from "./MobileLoadingState";

export default function MobileFlashcardPage() {
  const navigate = useNavigate();
  
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
    progress,
    sessionOptions,
    sessionTitle,
    handleAnswer,
    handleComplete,
    handleRegulationChange
  } = useLearningSession();

  // Lock the viewport and prevent scrolling with flashcard-mode class
  useEffect(() => {
    document.body.classList.add('flashcard-mode');
    document.documentElement.classList.add('overflow-hidden');
    document.documentElement.style.height = '100%';
    
    return () => {
      document.body.classList.remove('flashcard-mode');
      document.documentElement.classList.remove('overflow-hidden');
      document.documentElement.style.height = '';
    };
  }, []);

  // Handle loading state
  if (loading) {
    return <MobileLoadingState />;
  }

  // Handle access control
  if (!canAccess) {
    if (categoryRequiresAuth) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Anmeldung erforderlich</h2>
            <p className="text-gray-600 mb-4">Für diese Kategorie musst du angemeldet sein.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Anmelden
            </button>
          </div>
        </div>
      );
    }
  }

  // Handle error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 text-center max-w-sm">
          <h2 className="text-lg font-semibold mb-2 text-red-600">Fehler</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/karteikarten')}
            className="w-full py-2 bg-gray-600 text-white rounded-lg"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!loading && questions.length === 0 && !sessionFinished) {
    return <MobileEmptyState />;
  }

  // Handle completed session
  if (sessionFinished) {
    return <MobileSessionComplete 
      correctCount={correctCount}
      totalQuestions={questions.length}
    />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col h-full w-full overflow-hidden ios-viewport-fix">
      {/* Ultra-minimal header */}
      <div className="absolute top-2 left-2 z-10">
        <button 
          onClick={() => navigate('/karteikarten')}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      
      {/* Ultra-thin progress bar - fixed at the very top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
        <div 
          className="h-full bg-gradient-ultramarine gradient-shift"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      {/* Main content area - takes full screen */}
      <div className="flex-1 relative">
        <MobileFlashcardContent
          currentQuestion={questions[currentIndex]}
          currentIndex={currentIndex}
          totalCards={questions.length}
          correctCount={correctCount}
          remainingToday={progress?.totalQuestions || 0}
          onAnswer={handleAnswer}
          onNext={() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              handleComplete();
            }
          }}
          subCategoryTitle={sessionTitle}
          regulationFilter={sessionOptions.regulation as RegulationFilterType}
          onRegulationChange={handleRegulationChange}
        />
      </div>
    </div>
  );
}
