
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, List } from "lucide-react";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { useAuth } from "@/contexts/AuthContext";
import { Question } from "@/types/questions";
import { toast } from "sonner";

export default function LearningSessionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  
  // For spaced repetition, we don't filter by category or subcategory
  // to get all due cards across all categories
  const { loading, dueQuestions, submitAnswer, reloadQuestions } = useSpacedRepetition(
    "Signale", // Still need to pass a default category
    undefined,
    { practiceMode: false }
  );

  useEffect(() => {
    if (!loading && dueQuestions.length > 0) {
      // Shuffle the cards to create a mixed learning session
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  }, [loading, dueQuestions]);

  const handleAnswer = (score: number) => {
    if (currentIndex >= sessionCards.length) return;
    
    const currentCard = sessionCards[currentIndex];
    
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Submit answer for spaced repetition
    if (user && currentCard) {
      submitAnswer(currentCard.id, score);
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
            <Button onClick={() => navigate("/karteikarten")}>
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
      
      <main className="container flex-1 px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => navigate("/karteikarten")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center"
            onClick={() => navigate("/karteikarten")}
          >
            <List className="h-4 w-4 mr-1" />
            Alle Kategorien
          </Button>
        </div>

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
      </main>
      
      <Footer />
    </div>
  );
}
