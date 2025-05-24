
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/questions';
import { useUnifiedNavigation } from '@/hooks/navigation/useUnifiedNavigation';
import { usePathBasedCategories } from '@/hooks/categories/usePathBasedCategories';
import { useSpacedRepetition } from '@/hooks/spaced-repetition';
import { LearningSessionParams } from '@/types/navigation';

export function useUnifiedSession() {
  const { getCurrentParams, updateParams } = useUnifiedNavigation();
  const { resolveCategory, resolveCategoryByName } = usePathBasedCategories();
  const [sessionState, setSessionState] = useState<{
    questions: Question[];
    currentIndex: number;
    completed: boolean;
    progress: {
      total: number;
      current: number;
      correct: number;
      percentage: number;
    } | null;
  }>({
    questions: [],
    currentIndex: 0,
    completed: false,
    progress: null
  });

  const params = getCurrentParams();
  
  // Use the new clean spaced repetition hook
  const {
    questions: sessionQuestions,
    loading,
    error,
    progress: srProgress,
    submitAnswer: submitAnswerSR,
    loadQuestions,
    reset: resetSR
  } = useSpacedRepetition({
    category: params.category as any,
    subcategory: params.subcategory,
    regulation: params.regulation,
    mode: params.mode,
    boxNumber: params.box
  });

  // Load questions when params change
  useEffect(() => {
    if (params.category || params.subcategory) {
      loadQuestions({
        category: params.category as any,
        subcategory: params.subcategory,
        regulation: params.regulation,
        mode: params.mode,
        boxNumber: params.box
      });
    }
  }, [params.category, params.subcategory, params.regulation, params.mode, params.box, loadQuestions]);

  // Update session state when questions change
  useEffect(() => {
    if (sessionQuestions.length > 0) {
      const questions = sessionQuestions.map(sq => sq.question);
      setSessionState(prev => ({
        ...prev,
        questions,
        progress: {
          total: srProgress.totalQuestions,
          current: srProgress.currentQuestion,
          correct: srProgress.correctAnswers,
          percentage: srProgress.percentage
        }
      }));
    }
  }, [sessionQuestions, srProgress]);

  const submitAnswer = useCallback(async (questionId: string, score: number) => {
    await submitAnswerSR(questionId, score);
    
    // Update local progress
    setSessionState(prev => {
      const newCurrent = prev.progress ? prev.progress.current + 1 : 1;
      const newCorrect = prev.progress ? prev.progress.correct + (score > 2 ? 1 : 0) : (score > 2 ? 1 : 0);
      
      return {
        ...prev,
        progress: prev.progress ? {
          ...prev.progress,
          current: newCurrent,
          correct: newCorrect,
          percentage: (newCurrent / prev.progress.total) * 100
        } : null
      };
    });
  }, [submitAnswerSR]);

  const nextQuestion = useCallback(() => {
    setSessionState(prev => {
      const newIndex = prev.currentIndex + 1;
      const completed = newIndex >= prev.questions.length;
      
      return {
        ...prev,
        currentIndex: newIndex,
        completed
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    setSessionState({
      questions: [],
      currentIndex: 0,
      completed: false,
      progress: null
    });
    resetSR();
  }, [resetSR]);

  const getCurrentQuestion = useCallback((): Question | null => {
    if (sessionState.currentIndex >= sessionState.questions.length) {
      return null;
    }
    return sessionState.questions[sessionState.currentIndex];
  }, [sessionState.currentIndex, sessionState.questions]);

  return {
    // Session state
    loading,
    error,
    sessionState,
    params,
    
    // Current question
    currentQuestion: getCurrentQuestion(),
    
    // Actions
    submitAnswer,
    nextQuestion,
    resetSession,
    updateParams,
    
    // Utilities
    resolveCategory,
    resolveCategoryByName
  };
}
