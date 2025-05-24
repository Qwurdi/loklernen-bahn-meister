
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
  
  // Use spaced repetition hook for the actual question loading and submission
  const {
    loading,
    error,
    dueQuestions,
    progress: srProgress,
    submitAnswer: submitAnswerSR,
    reloadQuestions
  } = useSpacedRepetition(
    params.category as any,
    params.subcategory,
    { 
      practiceMode: params.mode === 'practice',
      regulationCategory: params.regulation === 'all' ? undefined : params.regulation,
      boxNumber: params.box
    }
  );

  // Update session state when questions change
  useEffect(() => {
    if (dueQuestions.length > 0) {
      // Calculate progress from questions array
      const totalQuestions = dueQuestions.length;
      const currentQuestion = sessionState.currentIndex + 1;
      
      setSessionState(prev => ({
        ...prev,
        questions: dueQuestions,
        progress: {
          total: totalQuestions,
          current: currentQuestion,
          correct: prev.progress?.correct || 0,
          percentage: (currentQuestion / totalQuestions) * 100
        }
      }));
    }
  }, [dueQuestions, sessionState.currentIndex]);

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
    reloadQuestions();
  }, [reloadQuestions]);

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
