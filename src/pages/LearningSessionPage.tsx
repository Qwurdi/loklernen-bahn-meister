
import { useNavigate } from "react-router-dom"; 
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionParams } from "@/hooks/learning-session/useSessionParams";
import { useCategories } from "@/hooks/useCategories";
import { useCategoryValidation } from "@/hooks/learning-session/useCategoryValidation";
import { useSessionState } from "@/hooks/learning-session/useSessionState";

import SessionContainer from "@/components/learning-session/SessionContainer";
import SessionHeader from "@/components/learning-session/SessionHeader";
import SessionLoadingState from "@/components/learning-session/SessionLoadingState";
import EmptySessionState from "@/components/learning-session/EmptySessionState";
import SessionCompleteState from "@/components/learning-session/SessionCompleteState";
import CardStackSession from "@/components/learning-session/CardStackSession";

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");

  const { user } = useAuth();
  const isMobile = useIsMobile();

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

  // Load categories data
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Validate category and handle authentication requirements
  const {
    categoryRequiresAuth,
    categoryFound,
    isParentCategory,
    stripRegulationInfo,
    getCategoryForSpacedRepetition
  } = useCategoryValidation(categories, categoriesLoading, categoryParam, isDueCardsView);

  // Pass both category, subcategory and regulation preference to the hook
  // Use optimized batch size of 15 cards per session
  const {
    loading: questionsLoading,
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount
  } = useSpacedRepetition(
    getCategoryForSpacedRepetition(),
    subcategoryParam,
    {
      practiceMode: false,
      regulationCategory: regulationParam,
      boxNumber: boxParam ? parseInt(boxParam, 10) : undefined, // Parse box number from string to number
      batchSize: 15,
      includeAllSubcategories: isParentCategory
    }
  );

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0);

  // Manage session state (cards, progress, etc)
  const {
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionCards,
    sessionFinished,
    handleAnswer,
    handleComplete,
    handleRestart
  } = useSessionState(questionsLoading, dueQuestions, categoryFound, categoryRequiresAuth, user);

  // Handle specific answer submission
  const onAnswer = async (questionId: string, score: number) => {
    await handleAnswer(questionId, score, user ? submitAnswer : undefined);
  };

  // Handle session completion
  const onComplete = () => {
    handleComplete(applyPendingUpdates);
    toast.success("Lernsession abgeschlossen! Gut gemacht!");
  };

  // Handle session restart
  const onRestart = async () => {
    await handleRestart(applyPendingUpdates, dueQuestions);
  };

  // Render loading states
  if (categoriesLoading && categoryParam) {
    return <SessionLoadingState />;
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
    return <SessionLoadingState />;
  }
  
  // Render loading state for questions
  if (questionsLoading) {
    return <SessionLoadingState />;
  }

  // Render empty state when no cards are available
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
          onRestart={onRestart}
          pendingUpdates={pendingUpdatesCount > 0}
        />
      </SessionContainer>
    );
  }

  // Render main learning session UI with our new card stack
  if ((categoryFound === true && (categoryRequiresAuth === false || (categoryRequiresAuth === true && !!user))) || isDueCardsView) {
    if (sessionCards.length > 0) {
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
              onAnswer={onAnswer}
              onComplete={onComplete}
              isMobile={isMobile}
            />
          </main>
        </SessionContainer>
      );
    } else if (!questionsLoading) {
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
  return <SessionLoadingState />;
}
