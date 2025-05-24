
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/hooks/learning-session/useSession";
import SessionContainer from "@/components/learning-session/SessionContainer";
import SessionRenderer from "@/components/learning-session/SessionRenderer";
import SessionLoadingState from "@/components/learning-session/SessionLoadingState";
import EmptySessionState from "@/components/learning-session/EmptySessionState";

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");
  const isMobile = useIsMobile();
  
  // Use our consolidated session hook to get all session data
  const {
    user,
    categoryParam,
    sessionTitle,
    categoryFound,
    categoryRequiresAuth,
    isParentCategory,
    stripRegulationInfo,
    categoriesLoading,
    questionsLoading,
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount,
    isDueCardsView,
  } = useSession();

  // Render loading states
  if (categoriesLoading && categoryParam) {
    return (
      <SessionContainer isMobile={isMobile}>
        <SessionLoadingState />
      </SessionContainer>
    );
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
    return (
      <SessionContainer isMobile={isMobile}>
        <SessionLoadingState />
      </SessionContainer>
    );
  }

  // Render the main session content
  return (
    <SessionContainer isMobile={isMobile} fullHeight={isMobile}>
      <SessionRenderer
        categoryParam={categoryParam}
        sessionTitle={sessionTitle}
        categoryFound={categoryFound}
        categoryRequiresAuth={categoryRequiresAuth}
        isParentCategory={isParentCategory}
        stripRegulationInfo={stripRegulationInfo}
        isDueCardsView={isDueCardsView}
        questionsLoading={questionsLoading}
        dueQuestions={dueQuestions}
        submitAnswer={submitAnswer}
        applyPendingUpdates={applyPendingUpdates}
        pendingUpdatesCount={pendingUpdatesCount}
        isMobile={isMobile}
      />
    </SessionContainer>
  );
}
