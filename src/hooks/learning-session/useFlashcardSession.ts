import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useSessionParams } from "./useSessionParams";
import { useFlashcardSessionState } from "./useFlashcardSessionState";

export function useFlashcardSession() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    regulationParam,
    searchParams,
    mainCategoryForHook,
    subCategoryParam,
    setRegulationFilter
  } = useSessionParams();

  const {
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    remainingToday,
    handleAnswer: handleSessionAnswer,
    handleComplete
  } = useFlashcardSessionState(user?.id);
  
  // Determine if we're in practice mode (no user logged in)
  const isPracticeMode = !user;

  // Get questions using spaced repetition system
  const {
    loading,
    dueQuestions: questions,
    submitAnswer
  } = useSpacedRepetition(
    mainCategoryForHook,
    subCategoryParam,
    { 
      practiceMode: isPracticeMode,
      regulationCategory: regulationParam
    }
  );

  // Wrap the handle answer function to use our spaced repetition submit answer
  const handleAnswer = async (questionId: string, score: number) => {
    await handleSessionAnswer(questionId, score, submitAnswer);
  };

  // Handle regulation change
  const handleRegulationChange = (value: any) => {
    setRegulationFilter(value);
  };

  return {
    loading,
    questions,
    user,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    remainingToday,
    subCategoryParam,
    mainCategoryForHook,
    isPracticeMode,
    regulationParam,
    searchParams,
    handleAnswer,
    handleComplete,
    handleRegulationChange,
    navigate
  };
}
