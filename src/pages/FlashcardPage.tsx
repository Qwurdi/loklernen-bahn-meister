
import { useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import FlashcardEmptyState from "@/components/flashcards/FlashcardEmptyState";
import FlashcardHeader from "@/components/flashcards/FlashcardHeader";
import CardStack from "@/components/flashcards/stack/CardStack";
import EmptySessionState from '@/components/learning-session/EmptySessionState';
import FlashcardSessionComplete from "@/components/flashcards/FlashcardSessionComplete";
import { useFlashcardSession } from "@/hooks/learning-session/useFlashcardSession";
import MobileFlashcardPage from "@/components/flashcards/mobile/MobileFlashcardPage";

export default function FlashcardPage() {
  console.log("FlashcardPage: Initializing component");
  
  const isMobile = useIsMobile();
  
  // If mobile, use the dedicated mobile page component
  if (isMobile) {
    return <MobileFlashcardPage />;
  }
  
  const {
    loading,
    questions,
    user,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    subCategoryForHook,
    mainCategoryForHook,
    isPracticeMode,
    handleAnswer,
    handleComplete,
    handleRegulationChange,
    searchParams,
    navigate
  } = useFlashcardSession();

  useEffect(() => {
    if (sessionFinished) {
      toast.success("Gut gemacht! Du hast alle Karten dieser Kategorie bearbeitet!");
    }
  }, [sessionFinished]);

  // Handle loading state
  if (loading) {
    return <FlashcardLoadingState />;
  }

  // Handle empty state
  if (!loading && questions.length === 0 && !sessionFinished) {
    const boxUrlParam = searchParams.get('box');
    const questionIdUrlParam = searchParams.get('questionId');
    const dueUrlParam = searchParams.get('due');
    const isGuest = !user;

    const isGuestLearningSpecificCategory =
      isGuest &&
      (!!searchParams.get('category') || searchParams.getAll('categories').length > 0 || !!searchParams.get('subcategory')) &&
      !boxUrlParam &&
      !questionIdUrlParam &&
      dueUrlParam !== 'true';

    if (isGuestLearningSpecificCategory) {
      return (
        <EmptySessionState
          categoryParam={mainCategoryForHook}
          isGuestLearningCategory={true}
        />
      );
    } else {
      if (dueUrlParam === 'true') {
        return <FlashcardEmptyState />;
      } else {
        return <EmptySessionState categoryParam={mainCategoryForHook} />;
      }
    }
  }

  // Handle completed session
  if (sessionFinished) {
    return <FlashcardSessionComplete 
      correctCount={correctCount}
      totalQuestions={questions.length}
      isMobile={false}
    />;
  }

  // Render the desktop flashcard view
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-6">
          <FlashcardHeader 
            subcategory={subCategoryForHook || mainCategoryForHook}
            isPracticeMode={isPracticeMode}
            onRegulationChange={handleRegulationChange}
          />
          
          <div className="h-full pt-2">
            <CardStack 
              questions={questions}
              onAnswer={handleAnswer}
              onComplete={handleComplete}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
