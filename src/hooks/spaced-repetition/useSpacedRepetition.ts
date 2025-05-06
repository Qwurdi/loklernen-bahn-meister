
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
  
  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount,
    applyPendingUpdates,
    reloadQuestions
  };
}
