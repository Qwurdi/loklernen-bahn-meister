
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useFlashcardSession } from "@/hooks/learning-session/useFlashcardSession";
import MobileFlashcardContent from "./MobileFlashcardContent";
import MobileSessionComplete from "./MobileSessionComplete";
import MobileEmptyState from "./MobileEmptyState";
import MobileLoadingState from "./MobileLoadingState";

export default function MobileFlashcardPage() {
  const navigate = useNavigate();
  
  const {
    loading,
    questions,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    remainingToday,
    subCategoryForHook,
    mainCategoryForHook,
    handleAnswer,
    handleComplete,
    handleRegulationChange,
    regulationParam
  } = useFlashcardSession();

  // Lock the viewport and prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
    };
  }, []);

  // Handle loading state
  if (loading) {
    return <MobileLoadingState />;
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
    <div className="fixed inset-0 bg-black flex flex-col h-full w-full overflow-hidden">
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
          remainingToday={remainingToday}
          onAnswer={handleAnswer}
          onNext={() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              handleComplete();
            }
          }}
          subCategoryTitle={subCategoryForHook || mainCategoryForHook}
          regulationFilter={regulationParam}
          onRegulationChange={handleRegulationChange}
        />
      </div>
    </div>
  );
}
