import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionParams } from "@/hooks/learning-session/useSessionParams";
import { useParentCategory } from "@/hooks/learning-session/useParentCategory";
import { useSessionAccess } from "@/hooks/learning-session/useSessionAccess";
import { useSessionState } from "@/hooks/learning-session/useSessionState";
import { useSessionInitialization } from "@/hooks/learning-session/useSessionInitialization";
import SessionContainer from "@/components/learning-session/SessionContainer";
import SessionContent from "@/components/learning-session/SessionContent";

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");

  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Get session parameters from URL
  const {
    singleCategoryIdentifier,
    multipleCategoryIdentifiers,
    regulationParam,
    boxParam,
    sessionTitle: initialSessionTitle,
    practiceMode
  } = useSessionParams();

  // Check if this is a parent category and resolve subcategories
  const {
    isParentCategory,
    resolvedCategoryIdentifiers,
    resolvedParentTitle
  } = useParentCategory(singleCategoryIdentifier);

  // Determine access status and handle auth/permissions
  const {
    accessStatus,
    resolvedSessionTitle,
    setResolvedSessionTitle,
    categoriesLoading
  } = useSessionAccess({
    singleCategoryIdentifier,
    multipleCategoryIdentifiers,
    isParentCategory,
    resolvedCategoryIdentifiers,
    practiceMode
  });

  // Memoize categoryIdentifiersForHook to prevent re-renders
  const categoryIdentifiersForHook = useMemo(() => {
    // If we resolved subcategories for a parent category, use those
    if (isParentCategory && resolvedCategoryIdentifiers.length > 0) {
      return resolvedCategoryIdentifiers;
    }
    // Otherwise use the original logic
    if (multipleCategoryIdentifiers && multipleCategoryIdentifiers.length > 0) {
      return multipleCategoryIdentifiers;
    }
    if (singleCategoryIdentifier) {
      return [singleCategoryIdentifier];
    }
    return [];
  }, [multipleCategoryIdentifiers, singleCategoryIdentifier, isParentCategory, resolvedCategoryIdentifiers]);

  // Set up session state and handlers
  const {
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionCards,
    sessionFinished,
    questionsLoading,
    pendingUpdatesCount,
    incorrectCardIdsInCurrentSession,
    handleAnswer,
    handleComplete,
    handleRestart,
    handleRestartIncorrect,
    initializeSession
  } = useSessionState({
    userId: user?.id,
    practiceMode,
    regulationParam,
    boxParam,
    categoryIdentifiers: categoryIdentifiersForHook,
    resolvedSessionTitle: resolvedParentTitle || resolvedSessionTitle || initialSessionTitle
  });

  // Initialize session based on URL params
  useSessionInitialization({
    userId: user?.id,
    practiceMode,
    accessStatus,
    categoryIdentifiers: categoryIdentifiersForHook,
    regulationParam,
    boxParam,
    initializeSession
  });

  // Set final session title based on all available information
  const finalSessionTitle = resolvedParentTitle || resolvedSessionTitle || initialSessionTitle;

  return (
    <SessionContainer isMobile={isMobile} fullHeight={isMobile}>
      <SessionContent
        accessStatus={accessStatus}
        categoriesLoading={categoriesLoading}
        questionsLoading={questionsLoading}
        sessionCards={sessionCards}
        sessionTitle={finalSessionTitle}
        isMobile={isMobile}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        correctCount={correctCount}
        totalCards={sessionCards.length}
        sessionFinished={sessionFinished}
        pendingUpdatesCount={pendingUpdatesCount}
        incorrectCardIdsInCurrentSession={incorrectCardIdsInCurrentSession}
        onAnswer={handleAnswer}
        onComplete={handleComplete}
        onRestart={handleRestart}
        onRestartIncorrect={handleRestartIncorrect}
      />
    </SessionContainer>
  );
}
