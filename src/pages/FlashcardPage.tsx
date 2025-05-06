
import React from "react";
import { useParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { mapUrlToSubcategory } from "@/hooks/useFlashcardUrl";
import { useMobileFullscreen } from "@/hooks/use-mobile-fullscreen";
import { useFlashcardSession } from "@/components/flashcards/session/useFlashcardSession";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import FlashcardEmptyState from "@/components/flashcards/FlashcardEmptyState";
import FlashcardSession from "@/components/flashcards/session/FlashcardSession";
import SessionCompletedView from "@/components/flashcards/session/SessionCompletedView";

export default function FlashcardPage() {
  console.log("FlashcardPage: Initializing component");
  
  // Extract subcategory from URL params and map it to the original subcategory
  const { subcategory: urlSubcategory } = useParams<{ subcategory: string }>();
  const subcategory = mapUrlToSubcategory(urlSubcategory);
  
  // Set up fullscreen mode for mobile devices
  const { isFullscreenMobile } = useMobileFullscreen(true);
  
  // Use our custom hook to handle all flashcard session logic
  const {
    loading,
    questions,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    regulationParam,
    handleRegulationChange,
    handleAnswer,
    handleComplete,
  } = useFlashcardSession({
    category: "Signale" as QuestionCategory,
    subcategory,
    isPracticeMode: true
  });
  
  console.log("FlashcardPage: Loaded questions count:", questions?.length || 0);

  // Loading state
  if (loading) {
    return <FlashcardLoadingState />;
  }

  // Empty state - no questions available
  if (!loading && (!questions || questions.length === 0)) {
    return <FlashcardEmptyState />;
  }

  // Session completed state
  if (sessionFinished) {
    return (
      <SessionCompletedView
        correctCount={correctCount}
        totalQuestions={questions.length}
      />
    );
  }

  // Main flashcard session view
  return (
    <FlashcardSession
      questions={questions}
      subcategory={subcategory}
      isPracticeMode={true}
      onRegulationChange={handleRegulationChange}
      handleAnswer={handleAnswer}
      handleComplete={handleComplete}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
    />
  );
}
