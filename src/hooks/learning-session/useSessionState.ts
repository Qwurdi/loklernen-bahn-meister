
import { useState, useMemo, useEffect } from "react";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { Flashcard, SessionType } from "@/hooks/spaced-repetition/types";
import { useToast } from "@/hooks/use-toast";
import { QuestionCategory } from "@/types/questions";

// Define a constant for the toast ID
const NO_CARDS_FOUND_TOAST_ID = "no-cards-found-toast";
const NO_CARDS_FOUND_TOAST_TITLE = "Keine Karten gefunden";

interface UseSessionStateProps {
  userId?: string;
  practiceMode: boolean;
  regulationParam?: string;
  boxParam?: number;
  categoryIdentifiers: string[];
  resolvedSessionTitle: string;
}

export function useSessionState({
  userId,
  practiceMode,
  regulationParam,
  boxParam,
  categoryIdentifiers,
  resolvedSessionTitle
}: UseSessionStateProps) {
  const { toast: manageCustomToast, toasts: customToastList } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  
  // Memoize options for useSpacedRepetition to prevent re-renders
  const spacedRepetitionOptions = useMemo(() => ({
    practiceMode: practiceMode,
    regulationCategory: regulationParam,
    boxNumber: boxParam,
    batchSize: 15
  }), [practiceMode, regulationParam, boxParam]);

  const {
    loading: questionsLoading,
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount,
    startNewSession,
    incorrectCardIdsInCurrentSession
  } = useSpacedRepetition(
    userId, 
    spacedRepetitionOptions
  );

  // Effect to update sessionCards when dueQuestions change
  useEffect(() => {
    if (!questionsLoading && dueQuestions && dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
      console.log("Session cards (Flashcards) set:", shuffled.length);
    } else if (!questionsLoading && (!dueQuestions || dueQuestions.length === 0)) {
      setSessionCards([]);
      console.log("No due questions (Flashcards), session cards set to empty.");
    }
  }, [questionsLoading, dueQuestions]);

  // Effect to show toast when no cards are found
  useEffect(() => {
    const isNoCardsToastActive = customToastList.some(
      (toast) => toast.title === NO_CARDS_FOUND_TOAST_TITLE && toast.open
    );
    
    if (!questionsLoading && sessionCards.length === 0 && !isNoCardsToastActive) {
      manageCustomToast({
        id: NO_CARDS_FOUND_TOAST_ID,
        title: NO_CARDS_FOUND_TOAST_TITLE,
        description: "Für deine Auswahl gibt es aktuell keine Lernkarten.",
        variant: "destructive",
      });
    }
  }, [questionsLoading, sessionCards, manageCustomToast, customToastList]);

  const handleAnswer = async (questionIdAsString: string, score: number) => {
    const questionId = Number(questionIdAsString);
    if (isNaN(questionId)) {
      console.error("Invalid questionId passed to handleAnswer:", questionIdAsString);
      return;
    }
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    if (userId) { 
      await submitAnswer(questionId, score); 
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);
    applyPendingUpdates().then(() => {
      manageCustomToast({
        title: "Lernsession abgeschlossen! Gut gemacht!",
        variant: "default",
      });
    });
  };

  const handleRestart = async () => {
    await applyPendingUpdates();
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
    
    let sessionType: SessionType = 'due'; 
    let categoryNameToLoad: string | undefined = undefined;

    if (boxParam !== undefined) {
      sessionType = 'all';
    } else if (categoryIdentifiers.length > 0) {
      sessionType = 'category';
      categoryNameToLoad = categoryIdentifiers.join(',');
    } else if (practiceMode) {
      sessionType = 'guest'; 
      if (categoryIdentifiers.length > 0) categoryNameToLoad = categoryIdentifiers.join(',');
    }

    await startNewSession(
      sessionType,
      categoryNameToLoad,
      regulationParam
    );
  };

  const handleRestartIncorrect = async () => {
    if (!incorrectCardIdsInCurrentSession || incorrectCardIdsInCurrentSession.length === 0) return;

    await applyPendingUpdates();
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
    
    await startNewSession(
      'specific_ids', 
      undefined, 
      regulationParam, 
      incorrectCardIdsInCurrentSession
    );
  };

  const initializeSession = async (sessionType: SessionType, categoryName?: string, cardIds?: number[]) => {
    console.log(`Initializing session with type: ${sessionType}, category: ${categoryName}, cardIds:`, cardIds);
    await startNewSession(sessionType, categoryName, regulationParam, cardIds);
  };

  return {
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
  };
}
