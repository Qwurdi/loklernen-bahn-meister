
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { useMobileFullscreen } from "@/hooks/use-mobile-fullscreen";
import { Shield } from "lucide-react";

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const isMobile = useIsMobile();
  
  // Get session parameters from URL
  const { 
    categoryParam, 
    subcategoryParam, 
    regulationParam, 
    boxParam,
    selectedCategories,
    sessionTitle 
  } = useSessionParams();

  console.log("Learning session parameters:", {
    category: categoryParam,
    subcategory: subcategoryParam,
    regulation: regulationParam,
    box: boxParam,
    selectedCategories
  });

  // Pass both category, subcategory and regulation preference to the hook
  const { 
    loading, 
    error,
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
      batchSize: 15,
      selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined
    }
  );

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !isFirstLoaded) {
        console.log("Loading timed out after 10 seconds");
        setLoadingTimedOut(true);
      }
    }, 10000);
    
    return () => clearTimeout(timeoutId);
  }, [loading, isFirstLoaded]);

  // Use useEffect with proper dependencies to shuffle cards only when necessary
  useEffect(() => {
    if (!loading && dueQuestions && dueQuestions.length > 0) {
      // Shuffle the cards to create a mixed learning session
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
      setIsFirstLoaded(true);
      console.log("Cards loaded and shuffled:", shuffled.length);
    } else if (!loading && dueQuestions && dueQuestions.length === 0) {
      // Make sure we set isFirstLoaded even when there are no questions
      setIsFirstLoaded(true);
      console.log("No cards loaded but loading finished");
    }
  }, [loading, dueQuestions]);

  // Show error state if needed
  useEffect(() => {
    if (!loading && error) {
      toast.error("Es ist ein Fehler beim Laden der Karten aufgetreten. Bitte versuche es später erneut.");
      console.error("Error in learning session:", error);
    }
  }, [loading, error]);

  // Memoize the answer handler
  const handleAnswer = useCallback(async (questionId: string, score: number) => {
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    
    // Submit answer for spaced repetition without reloading all cards
    if (user) {
      await submitAnswer(questionId, score);
    }
  }, [user, submitAnswer]);

  // Memoize the completion handler
  const handleComplete = useCallback(() => {
    setSessionFinished(true);

    // Apply all pending updates when session is complete
    applyPendingUpdates().then(() => {
      toast.success("Lernsession abgeschlossen! Gut gemacht!");
    });
  }, [applyPendingUpdates]);

  // Memoize the restart handler
  const handleRestart = useCallback(async () => {
    // Apply any pending updates before restarting
    await applyPendingUpdates();
    
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
    
    // Reset will shuffle cards again
    if (dueQuestions && dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  }, [applyPendingUpdates, dueQuestions]);

  // Handle cases when not logged in but trying to access learning features that require login
  const requiresLoginButNotLoggedIn = !user && !loading && !sessionCards.length;
  
  if (requiresLoginButNotLoggedIn) {
    return (
      <SessionContainer isMobile={isMobile}>
        <div className="container px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-amber-100 rounded-full p-4 mb-4">
            <Shield size={48} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-center">Login erforderlich</h2>
          <p className="text-gray-600 mb-6 text-center">
            Um deinen Lernfortschritt zu speichern, melde dich bitte an oder erstelle ein Konto.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-loklernen-ultramarine text-white rounded-md hover:bg-loklernen-sapphire"
            >
              Anmelden
            </button>
            <button 
              onClick={() => navigate('/karteikarten')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Zurück
            </button>
          </div>
        </div>
      </SessionContainer>
    );
  }

  // Render loading state - but exit after timeout
  if ((loading && !loadingTimedOut) || (!isFirstLoaded && !sessionCards.length && !loadingTimedOut)) {
    console.log("Rendering loading state");
    return <FlashcardLoadingState />;
  }

  // Handle loading timeout - show empty state with error info
  if (loadingTimedOut && !isFirstLoaded) {
    console.log("Loading timed out - showing error state");
    toast.error("Das Laden der Karten dauert ungewöhnlich lange. Bitte versuche es später erneut.");
    return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState categoryParam={categoryParam} showError={true} />
      </SessionContainer>
    );
  }

  // Render empty state when no cards are available
  if (!loading && !sessionCards.length) {
    console.log("No cards available - showing empty state");
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

  // Render main learning session UI with our card stack
  console.log("Rendering main learning session UI");
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
