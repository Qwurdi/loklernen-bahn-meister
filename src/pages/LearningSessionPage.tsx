
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, List } from "lucide-react";
import FlashcardContent from "@/components/flashcards/FlashcardContent";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { Question, QuestionCategory } from "@/types/questions";
import { toast } from "sonner";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useIsMobile } from "@/hooks/use-mobile";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function LearningSessionPage() {
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const isMobile = useIsMobile();
  
  // Prevent scrolling on mobile devices
  useEffect(() => {
    if (isMobile) {
      // Save the original style to restore it later
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
      
      // Cleanup function to restore original style
      return () => {
        document.body.style.overflow = originalStyle;
        document.documentElement.classList.remove('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
      };
    }
  }, [isMobile]);
  
  // Get category and regulation preference from URL parameters
  const categoryParam = searchParams.get("category") as QuestionCategory || "Signale";
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;

  // Pass both category and regulation preference to the hook
  const { loading, dueQuestions, submitAnswer, reloadQuestions } = useSpacedRepetition(
    categoryParam,
    undefined,
    { 
      practiceMode: false,
      regulationCategory: regulationParam
    }
  );

  useEffect(() => {
    if (!loading && dueQuestions.length > 0) {
      // Shuffle the cards to create a mixed learning session
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  }, [loading, dueQuestions]);

  const handleAnswer = async (score: number) => {
    if (currentIndex >= sessionCards.length) return;
    
    const currentCard = sessionCards[currentIndex];
    
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Submit answer for spaced repetition
    if (user && currentCard) {
      await submitAnswer(currentCard.id, score);
    }
  };

  const handleNext = () => {
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionFinished(true);
      toast.success("Lernsession abgeschlossen! Gut gemacht!");
    }
  };

  const handleRestart = async () => {
    await reloadQuestions();
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
  };

  const handleEndSession = () => {
    navigate("/karteikarten");
  };

  const getCategoryPath = () => {
    return categoryParam === "Betriebsdienst" 
      ? "/karteikarten/betriebsdienst" 
      : "/karteikarten";
  };

  // Render loading state
  if (loading) {
    return <FlashcardLoadingState />;
  }

  // Render empty state when no cards are available
  if (!sessionCards.length) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <Card className="p-6 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Keine Karten fällig!</h2>
            <p className="text-gray-600 mb-6">
              Aktuell sind keine Karten zur Wiederholung fällig. Schaue später wieder vorbei oder wähle eine Kategorie, um neue Karten zu lernen.
            </p>
            <Button onClick={() => navigate(getCategoryPath())}>
              Zu Kategorien
            </Button>
          </Card>
        </main>
        {!isMobile && <Footer />}
        {isMobile && <BottomNavigation />}
      </div>
    );
  }

  // Render finished session state
  if (sessionFinished) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <Card className="p-6 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Session abgeschlossen!</h2>
            <p className="text-gray-600 mb-6">
              Du hast {correctCount} von {sessionCards.length} Karten richtig beantwortet.
              ({Math.round((correctCount / sessionCards.length) * 100)}%)
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleRestart} variant="outline">
                Neu starten
              </Button>
              <Button onClick={handleEndSession} className="bg-loklernen-ultramarine">
                Zum Dashboard
              </Button>
            </div>
          </Card>
        </main>
        {!isMobile && <Footer />}
        {isMobile && <BottomNavigation />}
      </div>
    );
  }

  // Render main learning session UI
  const currentCard = sessionCards[currentIndex];
  
  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Navbar />
      
      <main className={`flex-1 ${isMobile ? 'px-2 pt-2 pb-20 overflow-hidden flex flex-col' : 'container px-4 py-8'}`}>
        {!isMobile && (
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => navigate(getCategoryPath())}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => navigate(getCategoryPath())}
            >
              <List className="h-4 w-4 mr-1" />
              Alle Kategorien
            </Button>
          </div>
        )}

        <FlashcardContent 
          currentQuestion={currentCard}
          currentIndex={currentIndex}
          totalCards={sessionCards.length}
          correctCount={correctCount}
          remainingToday={dueQuestions.length - currentIndex}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
