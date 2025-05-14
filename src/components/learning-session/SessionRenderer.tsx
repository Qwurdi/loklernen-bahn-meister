
import React from "react";
import { Question } from "@/types/questions";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionState } from "@/hooks/learning-session/useSessionState";
import SessionHeader from "@/components/learning-session/SessionHeader";
import SessionLoadingState from "@/components/learning-session/SessionLoadingState";
import EmptySessionState from "@/components/learning-session/EmptySessionState";
import SessionCompleteState from "@/components/learning-session/SessionCompleteState";
import CardStackSession from "@/components/learning-session/CardStackSession";
import { toast } from "sonner";

interface SessionRendererProps {
  categoryParam: string | null;
  sessionTitle: string;
  categoryFound: boolean | null;
  categoryRequiresAuth: boolean | null;
  isParentCategory: boolean;
  stripRegulationInfo: (name: string) => string;
  isDueCardsView: boolean;
  questionsLoading: boolean;
  dueQuestions: Question[];
  submitAnswer: (questionId: string, score: number) => Promise<void>;
  applyPendingUpdates: () => Promise<void>;
  pendingUpdatesCount: number;
  isMobile: boolean;
}

export default function SessionRenderer({
  categoryParam,
  sessionTitle,
  categoryFound,
  categoryRequiresAuth,
  isParentCategory,
  stripRegulationInfo,
  isDueCardsView,
  questionsLoading,
  dueQuestions,
  submitAnswer,
  applyPendingUpdates,
  pendingUpdatesCount,
  isMobile
}: SessionRendererProps) {
  const { user } = useAuth();

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
      const categoryName = stripRegulationInfo(categoryParam || '');
      emptyMessage = `Keine Karten für die Kategorie "${categoryName}" verfügbar.`;
      
      if (categoryName === "Betriebsdienst") {
        emptyMessage = "Für Betriebsdienst ist ein Konto erforderlich. Bitte melde dich an, um auf diese Kategorie zuzugreifen.";
      }
    }
    
    return (
      <EmptySessionState 
        message={emptyMessage}
        isGuestLearningCategory={isParentCategory && categoryRequiresAuth === true && !user}
      />
    );
  }
  
  // Render finished session state
  if (sessionFinished) {
    return (
      <SessionCompleteState
        correctCount={correctCount}
        totalCards={sessionCards.length}
        onRestart={onRestart}
        pendingUpdates={pendingUpdatesCount > 0}
      />
    );
  }

  // Render main learning session UI with our new card stack
  if ((categoryFound === true && (categoryRequiresAuth === false || (categoryRequiresAuth === true && !!user))) || isDueCardsView) {
    if (sessionCards.length > 0) {
      return (
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
      );
    } else if (!questionsLoading) {
      return (
        <EmptySessionState message={
          isDueCardsView 
            ? "Es sind keine fälligen Karten vorhanden."
            : `Keine Karten für "${sessionTitle}" verfügbar.`
        } />
      );
    }
  }
  
  // Fallback or if still resolving state, show loading.
  return <SessionLoadingState />;
}
