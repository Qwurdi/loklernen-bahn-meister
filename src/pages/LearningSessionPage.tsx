
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, List } from "lucide-react";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { Question, QuestionCategory } from "@/types/questions";
import { toast } from "sonner";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
    navigate("/");
  };

  const getCategoryPath = () => {
    return categoryParam === "Betriebsdienst" 
      ? "/karteikarten/betriebsdienst" 
      : "/karteikarten";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-center text-lg">Lade Karteikarten...</p>
        </main>
        <Footer />
      </div>
    );
  }

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
        <Footer />
      </div>
    );
  }

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
        <Footer />
      </div>
    );
  }

  const currentCard = sessionCards[currentIndex];
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className={`flex-1 ${isMobile ? 'px-2 py-2' : 'container px-4 py-8'}`}>
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

        <FlashcardProgress 
          currentIndex={currentIndex}
          totalCards={sessionCards.length}
          correctCount={correctCount}
          remainingToday={dueQuestions.length - currentIndex}
        />
        
        <div className="flex justify-center">
          <FlashcardItem
            question={currentCard}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </div>

        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-between bg-white border-t border-gray-200 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => navigate(getCategoryPath())}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Zurück</span>
            </Button>
            
            <div className="text-xs text-gray-500">
              {currentIndex + 1} / {sessionCards.length}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => navigate(getCategoryPath())}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Kategorien</span>
            </Button>
          </div>
        )}
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
}
