
import { useCallback } from 'react';
import { SpacedRepetitionOptions, SpacedRepetitionResult } from './types';
import { useSpacedRepetitionCore } from './hooks/useSpacedRepetitionCore';

/**
 * Enhanced spaced repetition hook with error handling, memory leak prevention, 
 * and performance optimizations
 */
export function useSpacedRepetition(
  category: string, 
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  // Use the core hook to manage the spaced repetition state and logic
  const {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount,
    applyPendingUpdates,
    reloadQuestions,
  } = useSpacedRepetitionCore(category, subcategory, options);
  
  // Enhance reloadQuestions with error handling
  const enhancedReloadQuestions = useCallback(async () => {
    try {
      await reloadQuestions();
    } catch (error) {
      console.error("Error reloading questions:", error);
      
      // The error will be handled by the core hook
      // Wir entfernen den return-Wert, damit die Funktion Promise<void> zurückgibt
    }
  }, [reloadQuestions]);
  
  // Enhance submitAnswer with error handling
  const enhancedSubmitAnswer = useCallback(async (questionId: string, score: number) => {
    try {
      return await submitAnswer(questionId, score);
    } catch (error) {
      console.error("Error submitting answer:", error);
      throw error; // Let the caller handle the error
    }
  }, [submitAnswer]);
  
  // Enhance applyPendingUpdates with error handling
  const enhancedApplyPendingUpdates = useCallback(async () => {
    try {
      return await applyPendingUpdates();
    } catch (error) {
      console.error("Error applying pending updates:", error);
      throw error; // Let the caller handle the error
    }
  }, [applyPendingUpdates]);
  
  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer: enhancedSubmitAnswer,
    pendingUpdatesCount,
    applyPendingUpdates: enhancedApplyPendingUpdates,
    reloadQuestions: enhancedReloadQuestions
  };
}
