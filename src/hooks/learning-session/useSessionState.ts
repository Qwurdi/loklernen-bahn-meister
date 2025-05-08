
import { useState, useEffect } from "react";
import { Question } from "@/types/questions";

export function useSessionState(
  questionsLoading: boolean,
  dueQuestions: Question[],
  categoryFound: boolean | null,
  categoryRequiresAuth: boolean | null,
  user: any
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);

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

  const handleAnswer = async (questionId: string, score: number, submitAnswer?: (id: string, score: number) => Promise<void>) => {
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }

    // Submit answer for spaced repetition without reloading all cards
    if (user && submitAnswer) {
      await submitAnswer(questionId, score);
    }
  };

  const handleComplete = (applyPendingUpdates?: () => Promise<void>) => {
    setSessionFinished(true);

    // Apply all pending updates when session is complete
    if (applyPendingUpdates) {
      applyPendingUpdates().then(() => {
        // Success notification is now handled in the main component
      });
    }
  };

  const handleRestart = async (applyPendingUpdates?: () => Promise<void>, dueQuestions?: Question[]) => {
    // Apply any pending updates before restarting
    if (applyPendingUpdates) {
      await applyPendingUpdates();
    }

    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);

    // Reset will shuffle cards again
    if (dueQuestions && dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  };

  return {
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionCards,
    sessionFinished,
    handleAnswer,
    handleComplete,
    handleRestart
  };
}
