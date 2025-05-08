
import React from "react";
import { AccessStatus } from "@/hooks/learning-session/useSessionAccess";
import { Flashcard } from "@/hooks/spaced-repetition/types";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import EmptySessionState from "@/components/learning-session/EmptySessionState";
import SessionCompleteState from "@/components/learning-session/SessionCompleteState";
import CardStackSession from "@/components/learning-session/CardStackSession";
import SessionHeader from "@/components/learning-session/SessionHeader";

interface SessionContentProps {
  accessStatus: AccessStatus;
  categoriesLoading: boolean;
  questionsLoading: boolean;
  sessionCards: Flashcard[];
  sessionTitle: string;
  isMobile: boolean;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  correctCount: number;
  totalCards: number;
  sessionFinished: boolean;
  pendingUpdatesCount: number;
  incorrectCardIdsInCurrentSession?: number[];
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  onRestart: () => Promise<void>;
  onRestartIncorrect: () => Promise<void>;
}

export default function SessionContent({
  accessStatus,
  categoriesLoading,
  questionsLoading,
  sessionCards,
  sessionTitle,
  isMobile,
  currentIndex,
  setCurrentIndex,
  correctCount,
  totalCards,
  sessionFinished,
  pendingUpdatesCount,
  incorrectCardIdsInCurrentSession = [],
  onAnswer,
  onComplete,
  onRestart,
  onRestartIncorrect
}: SessionContentProps) {

  // Render loading states based on accessStatus
  if (accessStatus === "pending" || categoriesLoading) {
    return <FlashcardLoadingState />;
  }

  if (accessStatus === "not_found") {
    return (
      <EmptySessionState message={`Die angeforderte Kategorie oder Kategorien wurden nicht gefunden.`} />
    );
  }

  if (accessStatus === "denied_auth" || accessStatus === "denied_pro") {
    // This state is brief due to navigation, but a loading indicator is good.
    return <FlashcardLoadingState />;
  }
  
  // Render loading state for questions if access is allowed or no specific selection
  if (questionsLoading && (accessStatus === "allowed" || accessStatus === "no_selection")) {
    return <FlashcardLoadingState />;
  }

  // Render empty state when no cards are available
  if ((accessStatus === "allowed" || accessStatus === "no_selection") && !sessionCards.length && !questionsLoading) {
    return <EmptySessionState categoryName={sessionTitle || "Auswahl"} />;
  }
  
  // Render finished session state
  if (sessionFinished) {
    return (
      <SessionCompleteState
        correctCount={correctCount}
        totalCards={totalCards}
        onRestart={onRestart}
        onRestartIncorrect={onRestartIncorrect}
        incorrectCardIds={incorrectCardIdsInCurrentSession}
        pendingUpdates={pendingUpdatesCount > 0}
      />
    );
  }

  // Render main learning session UI with card stack
  if ((accessStatus === "allowed" || accessStatus === "no_selection") && sessionCards.length > 0) {
    return (
      <main className={`flex-1 ${isMobile ? 'px-0 pt-2 pb-16 overflow-hidden flex flex-col' : 'container px-4 py-8'}`}>
        <SessionHeader
          sessionTitle={sessionTitle}
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
  }
  
  // Default fallback loading state if no other condition is met
  console.log("Fallback loading state rendered, accessStatus:", accessStatus);
  return <FlashcardLoadingState />;
}
