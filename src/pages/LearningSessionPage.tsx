
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import { useSessionParams } from "@/hooks/learning-session/useSessionParams";
import SessionContainer from "@/components/learning-session/SessionContainer";
import SessionHeader from "@/components/learning-session/SessionHeader";
import EmptySessionState from "@/components/learning-session/EmptySessionState";
import SessionCompleteState from "@/components/learning-session/SessionCompleteState";
import CardStackSession from "@/components/learning-session/CardStackSession";
import { Question } from "@/types/questions";

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const isMobile = useIsMobile();
  
  // Get session parameters from URL
  const { 
    categoryParam, 
    subcategoryParam, 
    regulationParam, 
    boxParam,
    sessionTitle 
  } = useSessionParams();

  console.log("Learning session parameters:", {
    category: categoryParam,
    subcategory: subcategoryParam,
    regulation: regulationParam,
    box: boxParam
  });

  // Pass both category, subcategory and regulation preference to the hook
  // Use optimized batch size of 15 cards per session
  const { 
    loading, 
    dueQuestions, 
    submitAnswer, 
    applyPendingUpdates, 
    pendingUpdatesCount 
  } = useSpacedRepetition(
    categoryParam,
    subcategoryParam,
    { 
      practiceMode: false,
      regulationCategory: regulationParam,
      boxNumber: boxParam,
      batchSize: 15 // Ideal batch size for balance between performance and cognitive load
    }
  );

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0);

  useEffect(() => {
    if (!loading && dueQuestions.length > 0) {
      // Shuffle the cards to create a mixed learning session
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  }, [loading, dueQuestions]);

  const handleAnswer = async (questionId: string, score: number) => {
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Submit answer for spaced repetition without reloading all cards
    if (user) {
      await submitAnswer(questionId, score);
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);

    // Apply all pending updates when session is complete
    applyPendingUpdates().then(() => {
      toast.success("Lernsession abgeschlossen! Gut gemacht!");
    });
  };

  const handleRestart = async () => {
    // Apply any pending updates before restarting
    await applyPendingUpdates();
    
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
    
    // Reset will shuffle cards again
    if (dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  };

  // Render loading state
  if (loading) {
    return <FlashcardLoadingState />;
  }

  // Render empty state when no cards are available
  if (!sessionCards.length) {
    return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState categoryParam={categoryParam} />
      </SessionContainer>
    );
  }

  // Render finished session state
  if (sessionFinished) {
    return (
      <SessionContainer isMobile={isMobile}>
        <SessionCompleteState 
          correctCount={correctCount} 
          totalCards={sessionCards.length}
          onRestart={handleRestart}
          pendingUpdates={pendingUpdatesCount > 0}
        />
      </SessionContainer>
    );
  }

  // Render main learning session UI with our new card stack
  return (
    <SessionContainer isMobile={isMobile} fullHeight={isMobile}>
      <main className={`flex-1 ${isMobile ? 'px-0 pt-2 pb-16 overflow-hidden flex flex-col' : 'container px-4 py-8'}`}>
        <SessionHeader 
          sessionTitle={sessionTitle} 
          categoryParam={categoryParam} 
          isMobile={isMobile} 
        />

        <CardStackSession
          sessionCards={sessionCards}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onAnswer={handleAnswer}
          onComplete={handleComplete}
          isMobile={isMobile}
        />
      </main>
    </SessionContainer>
  );
}
