
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, List } from "lucide-react";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { Question, QuestionCategory } from "@/types/questions";
import { toast } from "sonner";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useIsMobile } from "@/hooks/use-mobile";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import BottomNavigation from "@/components/layout/BottomNavigation";
import CardStack from "@/components/flashcards/stack/CardStack";

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");
  
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const isMobile = useIsMobile();
  
  // Get category, subcategory, regulation preference and box number from URL parameters
  const categoryParam = searchParams.get("category") as QuestionCategory || "Signale";
  const subcategoryParam = searchParams.get("subcategory");
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;
  const boxParam = searchParams.get("box") ? parseInt(searchParams.get("box") || "0") : undefined;

  console.log("Learning session parameters:", {
    category: categoryParam,
    subcategory: subcategoryParam,
    regulation: regulationParam,
    box: boxParam
  });

  // Prevent scrolling on mobile devices
  useEffect(() => {
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
  }, [isMobile]);

  // Pass both category, subcategory and regulation preference to the hook
  const { loading, dueQuestions, submitAnswer, reloadQuestions } = useSpacedRepetition(
    categoryParam,
    subcategoryParam,
    { 
      practiceMode: false,
      regulationCategory: regulationParam,
      boxNumber: boxParam
    }
  );

  // Create a more descriptive title based on parameters
  const getSessionTitle = () => {
    if (boxParam) {
      return `Box ${boxParam} - Lernmodus`;
    } 
    if (subcategoryParam) {
      return `${subcategoryParam} - Lernmodus`;
    }
    return 'Fällige Karten - Lernmodus';
  };

  const sessionTitle = getSessionTitle();

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0);

  useEffect(() => {
    if (!loading && dueQuestions.length > 0) {
      // Shuffle the cards to create a mixed learning session
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      // Limit to 36 cards max for consistency
      setSessionCards(shuffled.slice(0, 36));
    }
  }, [loading, dueQuestions]);

  const handleAnswer = async (questionId: string, score: number) => {
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Submit answer for spaced repetition
    if (user) {
      await submitAnswer(questionId, score);
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);
    toast.success("Lernsession abgeschlossen! Gut gemacht!");
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
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <Card className="p-6 max-w-md text-center bg-gray-900 border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-white">Keine Karten fällig!</h2>
            <p className="text-gray-300 mb-6">
              Aktuell sind keine Karten zur Wiederholung fällig. Schaue später wieder vorbei oder wähle eine Kategorie, um neue Karten zu lernen.
            </p>
            <Button onClick={() => navigate(getCategoryPath())} className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
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
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <Card className="p-6 max-w-md text-center bg-gray-900 border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-white">Session abgeschlossen!</h2>
            <p className="text-gray-300 mb-6">
              Du hast {correctCount} von {sessionCards.length} Karten richtig beantwortet.
              ({Math.round((correctCount / sessionCards.length) * 100)}%)
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleRestart} variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800">
                Neu starten
              </Button>
              <Button onClick={handleEndSession} className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
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

  // Render main learning session UI with our new card stack
  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-black text-white`}>
      <Navbar />
      
      <main className={`flex-1 ${isMobile ? 'px-0 pt-2 pb-16 overflow-hidden flex flex-col' : 'container px-4 py-8'}`}>
        {!isMobile && (
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800"
              onClick={() => navigate(getCategoryPath())}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            
            <h2 className="text-xl font-semibold">{sessionTitle}</h2>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-white hover:bg-gray-800"
              onClick={() => navigate(getCategoryPath())}
            >
              <List className="h-4 w-4 mr-1" />
              Alle Kategorien
            </Button>
          </div>
        )}

        {isMobile && (
          <div className="px-3 pt-2 pb-1">
            <h2 className="text-xl font-semibold">{sessionTitle}</h2>
          </div>
        )}

        <div className="h-full w-full flex-1 flex flex-col">
          <CardStack 
            questions={sessionCards}
            onAnswer={handleAnswer}
            onComplete={handleComplete}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
