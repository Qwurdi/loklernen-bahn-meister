
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/hooks/learning-session/useSession";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";
import FlashcardHeader from "@/components/flashcards/FlashcardHeader";
import { ChevronLeft } from "lucide-react";

export default function FlashcardPage() {
  const isMobile = useIsMobile();
  
  const {
    loading,
    questions,
    user,
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

  // Handle loading state
  if (loading) {
    return (
      <div className={`${isMobile ? 'fixed inset-0 bg-black' : 'flex flex-col min-h-screen'} ${isMobile ? '' : 'bg-black text-white'}`}>
        {!isMobile && <Navbar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-loklernen-ultramarine mx-auto mb-4"></div>
            <p className={isMobile ? 'text-white' : 'text-white'}>Lade Karteikarten...</p>
          </div>
        </div>
        {!isMobile && <Footer />}
      </div>
    );
  }

  // Handle empty state
  if (!loading && questions.length === 0 && !sessionFinished) {
    return (
      <div className={`${isMobile ? 'fixed inset-0 bg-black' : 'flex flex-col min-h-screen'} ${isMobile ? '' : 'bg-black text-white'}`}>
        {!isMobile && <Navbar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-white' : 'text-white'}`}>
              Keine Karten verfügbar
            </h2>
            <p className={`text-gray-400 mb-6`}>
              {isPracticeMode 
                ? "Melde dich an, um auf alle Karten zuzugreifen."
                : "Es sind keine fälligen Karten vorhanden."
              }
            </p>
            <button 
              onClick={() => navigate('/karteikarten')}
              className="bg-loklernen-ultramarine text-white px-6 py-2 rounded-lg hover:bg-loklernen-sapphire"
            >
              Zurück zu den Kategorien
            </button>
          </div>
        </div>
        {!isMobile && <Footer />}
      </div>
    );
  }

  // Handle completed session
  if (sessionFinished) {
    return (
      <div className={`${isMobile ? 'fixed inset-0 bg-black' : 'flex flex-col min-h-screen'} ${isMobile ? '' : 'bg-black text-white'}`}>
        {!isMobile && <Navbar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isMobile ? 'text-white' : 'text-white'}`}>
              Session abgeschlossen!
            </h2>
            <p className={`text-gray-400 mb-2`}>
              Du hast {correctCount} von {questions.length} Karten richtig beantwortet.
            </p>
            <p className={`text-gray-400 mb-6`}>
              Gut gemacht! 🎉
            </p>
            <button 
              onClick={() => navigate('/karteikarten')}
              className="bg-loklernen-ultramarine text-white px-6 py-2 rounded-lg hover:bg-loklernen-sapphire"
            >
              Zurück zu den Kategorien
            </button>
          </div>
        </div>
        {!isMobile && <Footer />}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Mobile layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col h-full w-full overflow-hidden ios-viewport-fix">
        {/* Header */}
        <div className="absolute top-2 left-2 z-10">
          <button 
            onClick={() => navigate('/karteikarten')}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
          <div 
            className="h-full bg-gradient-ultramarine gradient-shift"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 relative pt-12">
          <div className="h-full flex flex-col">
            <FlashcardProgress 
              currentIndex={currentIndex}
              totalCards={questions.length}
              correctCount={correctCount}
              remainingToday={remainingToday}
            />
            
            <div className="flex-1 flex items-center justify-center">
              <FlashcardItem 
                question={currentQuestion} 
                onAnswer={(score) => handleAnswer(currentQuestion.id, score)}
                onNext={() => {
                  if (currentIndex < questions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  } else {
                    handleComplete();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-6">
          <FlashcardHeader 
            subcategory={subCategoryParam || mainCategoryForHook}
            isPracticeMode={isPracticeMode}
            onRegulationChange={handleRegulationChange}
          />
          
          <div className="space-y-6 pt-2">
            <FlashcardProgress 
              currentIndex={currentIndex}
              totalCards={questions.length}
              correctCount={correctCount}
              remainingToday={remainingToday}
            />
            
            <FlashcardItem 
              question={currentQuestion} 
              onAnswer={(score) => handleAnswer(currentQuestion.id, score)}
              onNext={() => {
                if (currentIndex < questions.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  handleComplete();
                }
              }}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
