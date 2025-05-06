
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
import { Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [fallbackMode, setFallbackMode] = useState(false);
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

  // Use useMemo for spaced repetition options to prevent unnecessary rerenders
  const spacedRepetitionOptions = useMemo(() => ({
    practiceMode: false,
    regulationCategory: regulationParam,
    boxNumber: boxParam,
    batchSize: 20, // Increased batch size
    selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined
  }), [regulationParam, boxParam, selectedCategories]);

  // Pass both category, subcategory and regulation preference to the hook
  const { 
    loading, 
    error,
    dueQuestions, 
    submitAnswer, 
    applyPendingUpdates, 
    pendingUpdatesCount,
    reloadQuestions
  } = useSpacedRepetition(
    categoryParam,
    subcategoryParam,
    spacedRepetitionOptions
  );

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !isFirstLoaded) {
        console.log("Loading timed out after 8 seconds");
        setLoadingTimedOut(true);
        
        // Attempt to switch to practice mode as fallback
        if (!fallbackMode && dueQuestions.length === 0) {
          console.log("Switching to fallback mode (practice)");
          setFallbackMode(true);
          
          // Notify user about fallback mode
          toast.info("Langsame Verbindung erkannt. Wechsle zu Übungskarten...", {
            duration: 4000
          });
        }
      }
    }, 8000); // Reduced timeout threshold
    
    return () => clearTimeout(timeoutId);
  }, [loading, isFirstLoaded, fallbackMode, dueQuestions.length]);

  // Try to reload questions if in fallback mode
  useEffect(() => {
    let fallbackTimeout: NodeJS.Timeout | null = null;
    
    if (fallbackMode) {
      // Try to reload questions with practice mode
      fallbackTimeout = setTimeout(() => {
        reloadQuestions();
      }, 1000);
    }
    
    return () => {
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
    };
  }, [fallbackMode, reloadQuestions]);

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
      console.error("Error in learning session:", error);
      
      // Show friendly error message
      toast.error("Fehler beim Laden der Karten. Versuche es mit Übungskarten.", {
        duration: 5000,
        id: 'session-error' // Prevent duplicate toasts
      });
    }
  }, [loading, error]);

  // Memoize the answer handler for better performance
  const handleAnswer = useCallback(async (questionId: string, score: number) => {
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    
    try {
      // Submit answer for spaced repetition without reloading all cards
      if (user) {
        await submitAnswer(questionId, score);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      
      // Don't block the user when submission fails
      toast.error("Antwort konnte nicht gespeichert werden. Fortfahren ist trotzdem möglich.");
    }
  }, [user, submitAnswer]);

  // Memoize the completion handler
  const handleComplete = useCallback(() => {
    setSessionFinished(true);

    // Apply all pending updates when session is complete
    applyPendingUpdates().catch(error => {
      console.error("Error applying pending updates:", error);
      toast.error("Einige Änderungen konnten nicht gespeichert werden.");
    });
    
    toast.success("Lernsession abgeschlossen! Gut gemacht!");
  }, [applyPendingUpdates]);

  // Memoize the restart handler
  const handleRestart = useCallback(async () => {
    // Apply any pending updates before restarting
    try {
      await applyPendingUpdates();
    } catch (error) {
      console.error("Error applying updates:", error);
    }
    
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

  // Handle loading timeout - show better error UI with retry option
  if (loadingTimedOut && !isFirstLoaded && !sessionCards.length) {
    console.log("Loading timed out - showing error state with retry option");
    
    return (
      <SessionContainer isMobile={isMobile}>
        <div className="container px-4 py-8">
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTitle className="text-amber-800">Verbindungsprobleme</AlertTitle>
            <AlertDescription className="text-amber-700">
              Das Laden der Karten dauert ungewöhnlich lange. Möglicherweise gibt es Verbindungsprobleme.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col items-center gap-4 mt-8">
            <button
              onClick={() => {
                setLoadingTimedOut(false);
                reloadQuestions();
              }}
              className="px-4 py-2 bg-loklernen-ultramarine text-white rounded-md hover:bg-loklernen-sapphire"
            >
              Erneut versuchen
            </button>
            
            <button
              onClick={() => navigate('/karteikarten')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Zurück zur Übersicht
            </button>
          </div>
        </div>
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

        {fallbackMode && (
          <Alert className="mb-4 mx-4 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-700 text-sm">
              Übungskarten werden angezeigt. Dein Lernfortschritt wird trotzdem gespeichert.
            </AlertDescription>
          </Alert>
        )}

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
