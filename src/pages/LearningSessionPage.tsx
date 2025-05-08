
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
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
import { useCategories } from "@/hooks/useCategories"; 
import { Category } from "@/api/categories/types"; 

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const isMobile = useIsMobile();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);

  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(); 
  const [categoryRequiresAuth, setCategoryRequiresAuth] = useState<boolean | null>(null); 
  const [categoryFound, setCategoryFound] = useState<boolean | null>(null); 
  const [isParentCategory, setIsParentCategory] = useState<boolean>(false);

  // Get session parameters from URL
  const {
    categoryParam,
    subcategoryParam,
    regulationParam,
    boxParam,
    sessionTitle,
    isDueCardsView
  } = useSessionParams();

  console.log("Learning session parameters:", {
    category: categoryParam,
    subcategory: subcategoryParam,
    regulation: regulationParam,
    box: boxParam,
    isDueCardsView
  });

  // Helper function to strip regulation info from category name
  const stripRegulationInfo = (categoryName: string | null): string | null => {
    if (!categoryName) return null;
    
    // Remove patterns like " (DS 301)" or " (DV 301)" from category name
    return categoryName.replace(/\s*\((?:DS|DV)\s+301\)$/i, "");
  };

  // Effect to check category and authentication requirements
  useEffect(() => {
    if (categoriesLoading) {
      setCategoryFound(null);
      setCategoryRequiresAuth(null);
      setIsParentCategory(false);
      return;
    }

    // If we're in a due cards view, we don't need to validate category existence
    if (isDueCardsView) {
      console.log("Due cards view - skipping category validation");
      setCategoryFound(true);
      setCategoryRequiresAuth(false);
      setIsParentCategory(false);
      return;
    }

    // Only validate if we have a specific categoryParam
    if (categoryParam) {
      // Strip regulation information for comparing with database categories
      const cleanCategoryName = stripRegulationInfo(categoryParam);
      console.log("Clean category name for comparison:", cleanCategoryName);
      
      // Check if this is a parent category (Signale or Betriebsdienst)
      if (cleanCategoryName === "Signale" || cleanCategoryName === "Betriebsdienst") {
        console.log("Parent category detected:", cleanCategoryName);
        setCategoryFound(true);
        setIsParentCategory(true);
        
        // For parent categories, check auth requirements
        const requiresAuth = cleanCategoryName === "Betriebsdienst";
        setCategoryRequiresAuth(requiresAuth);
        
        // If authentication is required but user is not logged in
        if (requiresAuth && !user) {
          toast.info("Für diese Kategorie ist eine Anmeldung erforderlich.", {
            description: "Bitte melde dich an, um auf diese Lernkarten zuzugreifen.",
          });
          navigate("/login", { replace: true, state: { from: location.pathname } });
        }
        return;
      }
      
      // Look for the category in the database
      const currentCategory = categories.find(
        (cat: Category) => 
          cat.name === cleanCategoryName || 
          cat.id === cleanCategoryName
      );

      if (currentCategory) {
        setCategoryFound(true);
        setIsParentCategory(false);
        const requiresAuth = !!currentCategory.requiresAuth;
        setCategoryRequiresAuth(requiresAuth);
        
        if (requiresAuth && !user) {
          toast.info("Für diese Kategorie ist eine Anmeldung erforderlich.", {
            description: "Bitte melde dich an, um auf diese Lernkarten zuzugreifen.",
          });
          navigate("/login", { replace: true, state: { from: location.pathname } });
        }
      } else {
        setCategoryFound(false);
        setCategoryRequiresAuth(null);
        setIsParentCategory(false);
      }
    } else {
      // No category provided but not in a due cards view
      // This is an edge case that should be handled
      setCategoryFound(true);
      setCategoryRequiresAuth(false);
      setIsParentCategory(false);
    }
  }, [categories, categoriesLoading, categoryParam, user, navigate, location, isDueCardsView]);

  // Pass both category, subcategory and regulation preference to the hook
  // Use optimized batch size of 15 cards per session
  const {
    loading: questionsLoading,
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount
  } = useSpacedRepetition(
    // For due cards view or parent categories, don't filter by category or use clean category name
    isDueCardsView ? null : (isParentCategory ? stripRegulationInfo(categoryParam) : categoryParam),
    subcategoryParam,
    {
      practiceMode: false,
      regulationCategory: regulationParam,
      boxNumber: boxParam,
      batchSize: 15,
      // For parent categories, fetch cards from all subcategories
      includeAllSubcategories: isParentCategory
    }
  );

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0);

  useEffect(() => {
    // Only shuffle and set cards if category is found and auth requirements are met (or not applicable)
    if (categoryFound === false || (categoryRequiresAuth === true && !user)) {
        setSessionCards([]); // Clear cards if auth fails or category not found
        return;
    }
    if (!questionsLoading && dueQuestions.length > 0) {
      // Shuffle the cards to create a mixed learning session
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    } else if (!questionsLoading && dueQuestions.length === 0) {
      setSessionCards([]); // Ensure sessionCards is empty if no due questions
    }
  }, [questionsLoading, dueQuestions, categoryFound, categoryRequiresAuth, user]);

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

  // Render loading states
  if (categoriesLoading && categoryParam) { // Show specific loading if categoryParam is present
    return <FlashcardLoadingState />; // Message: "Lade Kategorieinformationen..." (implicit)
  }

  if (categoryParam && categoryFound === false && !categoriesLoading) {
    const cleanCategoryName = stripRegulationInfo(categoryParam);
    return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState message={`Die Kategorie "${cleanCategoryName}" wurde nicht gefunden.`} />
      </SessionContainer>
    );
  }

  if (categoryRequiresAuth === true && !user && categoryParam) {
    // This state is brief due to navigation, but a loading indicator is good.
    return <FlashcardLoadingState />; // Message: "Weiterleitung zum Login..." (implicit)
  }
  
  // Render loading state for questions
  if (questionsLoading) {
    return <FlashcardLoadingState />; // Message: "Lade Lernkarten..." (implicit)
  }

  // Render empty state when no cards are available
  // This covers: category found but no cards, or no categoryParam provided.
  if (!sessionCards.length && (categoryFound === true || !categoryParam)) {
    // Special message for parent categories
    let emptyMessage = isDueCardsView 
      ? "Es sind keine fälligen Karten vorhanden."
      : `Keine Karten für "${sessionTitle}" verfügbar.`;
    
    // Special message for parent categories
    if (isParentCategory) {
      const categoryName = stripRegulationInfo(categoryParam);
      emptyMessage = `Keine Karten für die Kategorie "${categoryName}" verfügbar.`;
      
      if (categoryName === "Betriebsdienst") {
        emptyMessage = "Für Betriebsdienst ist ein Konto erforderlich. Bitte melde dich an, um auf diese Kategorie zuzugreifen.";
      }
    }
    
    return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState 
          message={emptyMessage}
          isGuestLearningCategory={isParentCategory && categoryRequiresAuth === true && !user}
        />
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
  // This part should only render if a category is resolved (or no categoryParam) and cards are ready
  if ((categoryFound === true && (categoryRequiresAuth === false || (categoryRequiresAuth === true && !!user))) || isDueCardsView) {
     if (sessionCards.length > 0) { // Ensure cards are loaded before rendering stack
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
     } else if (!questionsLoading) { // If not loading and no cards, show empty state
        return (
            <SessionContainer isMobile={isMobile}>
                <EmptySessionState message={
                  isDueCardsView 
                    ? "Es sind keine fälligen Karten vorhanden."
                    : `Keine Karten für "${sessionTitle}" verfügbar.`
                } />
            </SessionContainer>
        );
     }
  }
  
  // Fallback or if still resolving state, show loading.
  return <FlashcardLoadingState />;
}
