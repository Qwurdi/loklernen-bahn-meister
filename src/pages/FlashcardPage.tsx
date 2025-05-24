
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/hooks/learning-session/useSession";
import FlashcardPageLayout from "@/components/flashcards/FlashcardPageLayout";
import FlashcardPageContent from "@/components/flashcards/FlashcardPageContent";
import { LoadingState, EmptyState, CompletedState } from "@/components/flashcards/FlashcardPageStates";

export default function FlashcardPage() {
  const isMobile = useIsMobile();
  
  const {
    loading,
    questions,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    remainingToday,
    subCategoryParam,
    mainCategoryForHook,
    isPracticeMode,
    handleAnswer,
    handleComplete,
    handleRegulationChange,
    navigate
  } = useSession();

  // Lock viewport for mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('flashcard-mode');
      document.documentElement.classList.add('overflow-hidden');
      document.documentElement.style.height = '100%';
      
      return () => {
        document.body.classList.remove('flashcard-mode');
        document.documentElement.classList.remove('overflow-hidden');
        document.documentElement.style.height = '';
      };
    }
  }, [isMobile]);

  useEffect(() => {
    if (sessionFinished) {
      toast.success("Gut gemacht! Du hast alle Karten dieser Kategorie bearbeitet!");
    }
  }, [sessionFinished]);

  const handleNavigateBack = () => navigate('/karteikarten');

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <FlashcardPageLayout isMobile={isMobile}>
      {loading && <LoadingState isMobile={isMobile} />}
      
      {!loading && questions.length === 0 && !sessionFinished && (
        <EmptyState 
          isMobile={isMobile}
          isPracticeMode={isPracticeMode}
          onNavigateBack={handleNavigateBack}
        />
      )}
      
      {sessionFinished && (
        <CompletedState
          isMobile={isMobile}
          correctCount={correctCount}
          totalQuestions={questions.length}
          onNavigateBack={handleNavigateBack}
        />
      )}
      
      {!loading && questions.length > 0 && !sessionFinished && (
        <FlashcardPageContent
          currentQuestion={questions[currentIndex]}
          currentIndex={currentIndex}
          totalCards={questions.length}
          correctCount={correctCount}
          remainingToday={remainingToday}
          subCategoryParam={subCategoryParam}
          mainCategoryForHook={mainCategoryForHook}
          isPracticeMode={isPracticeMode}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onRegulationChange={handleRegulationChange}
          onNavigateBack={handleNavigateBack}
        />
      )}
    </FlashcardPageLayout>
  );
}
