
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

export default function FlashcardPage() {
  console.log("FlashcardPage: Initializing component");
  
  const isMobile = useIsMobile();
  
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

  // Properly handle mobile viewport
  useEffect(() => {
    const handleResize = () => {
      // When on mobile, update CSS viewport height variable
      if (isMobile) {
        // Set a CSS variable for the real viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    };
    
    // Apply overflow control for mobile
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.height = '100%';
      document.documentElement.style.width = '100%';
      
      // Calculate initial viewport height
      handleResize();
      // Add listener for orientation changes
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      // Clean up all styles when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.height = '';
      document.documentElement.style.width = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

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
      isMobile={isMobile}
    />;
  }

  // Mobile-optimized class for container
  const containerClasses = isMobile 
    ? 'h-[calc(100vh-var(--bottom-nav-height,64px))] max-h-[calc(var(--vh,1vh)*100-var(--bottom-nav-height,64px))] overflow-hidden'
    : 'min-h-screen';

  // Render the main flashcard view
  return (
    <div className={`flex flex-col ${containerClasses} bg-black text-white`}>
      <Navbar />
      
      <main className="flex-1 relative overflow-hidden">
        <div className={`${isMobile ? 'px-0 pt-0 pb-16 h-full' : 'container px-4 py-6'}`}>
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
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
