
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useSessionParams } from "./useSessionParams";
import { useCategoryValidation } from "./useCategoryValidation";
import { useCategories } from "@/hooks/useCategories";
import { Question } from "@/types/questions";

export function useSession() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Get session parameters
  const {
    regulationParam,
    searchParams,
    mainCategoryForHook,
    subCategoryParam,
    setRegulationFilter,
    categoryParam,
    sessionTitle,
    isDueCardsView,
    boxParam
  } = useSessionParams();

  // Load categories data
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Validate category
  const {
    categoryRequiresAuth,
    categoryFound,
    isParentCategory,
    stripRegulationInfo,
    getCategoryForSpacedRepetition
  } = useCategoryValidation(categories, categoriesLoading, categoryParam, isDueCardsView);

  // Determine if we're in practice mode
  const isPracticeMode = !user;

  // Get questions using spaced repetition system
  const {
    loading: questionsLoading,
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount
  } = useSpacedRepetition(
    getCategoryForSpacedRepetition(),
    subCategoryParam,
    { 
      practiceMode: isPracticeMode,
      regulationCategory: regulationParam,
      boxNumber: boxParam ? parseInt(boxParam, 10) : undefined,
      batchSize: 15,
      includeAllSubcategories: isParentCategory
    }
  );

  // Update session cards when questions change
  useEffect(() => {
    if (categoryFound === false || (categoryRequiresAuth === true && !user)) {
      setSessionCards([]);
      return;
    }
    
    if (!questionsLoading && dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    } else if (!questionsLoading && dueQuestions.length === 0) {
      setSessionCards([]);
    }
  }, [questionsLoading, dueQuestions, categoryFound, categoryRequiresAuth, user]);

  // Get due today count for progress display
  const remainingToday = dueQuestions.length;

  // Handle answer submission
  const handleAnswer = async (questionId: string, score: number) => {
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }

    if (user && submitAnswer) {
      await submitAnswer(questionId, score);
    }
  };

  // Handle session completion
  const handleComplete = () => {
    setSessionFinished(true);
    
    if (applyPendingUpdates) {
      applyPendingUpdates();
    }
  };

  // Handle session restart
  const handleRestart = async () => {
    if (applyPendingUpdates) {
      await applyPendingUpdates();
    }

    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);

    if (dueQuestions && dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  };

  // Handle regulation change
  const handleRegulationChange = (value: any) => {
    setRegulationFilter(value);
  };

  return {
    // Loading states
    loading: categoriesLoading || questionsLoading,
    categoriesLoading,
    questionsLoading,
    
    // Data
    questions: sessionCards,
    dueQuestions,
    user,
    categories,
    
    // Session state
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    remainingToday,
    
    // Parameters
    subCategoryParam,
    mainCategoryForHook,
    categoryParam,
    sessionTitle,
    isDueCardsView,
    isPracticeMode,
    regulationParam,
    searchParams,
    
    // Category validation
    categoryRequiresAuth,
    categoryFound,
    isParentCategory,
    stripRegulationInfo,
    
    // Actions
    handleAnswer,
    handleComplete,
    handleRestart,
    handleRegulationChange,
    navigate,
    
    // Advanced
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount
  };
}

// Legacy export for backward compatibility
export const useFlashcardSession = useSession;
