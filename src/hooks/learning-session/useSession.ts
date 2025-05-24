
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

  // Get questions using the clean spaced repetition system
  const {
    questions: sessionQuestions,
    loading: questionsLoading,
    error: questionsError,
    progress,
    submitAnswer,
    loadQuestions,
    reset
  } = useSpacedRepetition({
    category: getCategoryForSpacedRepetition() as any,
    subcategory: subCategoryParam,
    regulation: regulationParam || 'all',
    mode: isPracticeMode ? 'practice' : (boxParam ? 'boxes' : 'review'),
    boxNumber: boxParam ? parseInt(boxParam, 10) : undefined,
    batchSize: 15,
    includeAllSubcategories: isParentCategory
  });

  // Load questions when parameters change
  useEffect(() => {
    if (categoryFound !== false && (!categoryRequiresAuth || user)) {
      loadQuestions({
        category: getCategoryForSpacedRepetition() as any,
        subcategory: subCategoryParam,
        regulation: regulationParam || 'all',
        mode: isPracticeMode ? 'practice' : (boxParam ? 'boxes' : 'review'),
        boxNumber: boxParam ? parseInt(boxParam, 10) : undefined,
        batchSize: 15,
        includeAllSubcategories: isParentCategory
      });
    }
  }, [
    categoryFound,
    categoryRequiresAuth,
    user,
    getCategoryForSpacedRepetition,
    subCategoryParam,
    regulationParam,
    isPracticeMode,
    boxParam,
    isParentCategory,
    loadQuestions
  ]);

  // Update session cards when questions change
  useEffect(() => {
    if (categoryFound === false || (categoryRequiresAuth === true && !user)) {
      setSessionCards([]);
      return;
    }
    
    if (!questionsLoading && sessionQuestions.length > 0) {
      // Extract questions from SessionQuestion objects
      const questions = sessionQuestions.map(sq => sq.question);
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    } else if (!questionsLoading && sessionQuestions.length === 0) {
      setSessionCards([]);
    }
  }, [questionsLoading, sessionQuestions, categoryFound, categoryRequiresAuth, user]);

  // Extract questions for backward compatibility
  const dueQuestions = sessionQuestions.map(sq => sq.question);

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
  };

  // Handle session restart
  const handleRestart = async () => {
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
    
    // Advanced (for backward compatibility)
    submitAnswer,
    applyPendingUpdates: () => Promise.resolve(), // No-op in clean architecture
    pendingUpdatesCount: 0 // Always 0 in clean architecture
  };
}

// Legacy export for backward compatibility
export const useFlashcardSession = useSession;
