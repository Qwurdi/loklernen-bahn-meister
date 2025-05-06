
import { useCallback } from 'react';
import { SpacedRepetitionOptions, SpacedRepetitionResult } from './types';
import { useSpacedRepetitionData } from './hooks/useSpacedRepetitionData';
import { useQuestionUpdates } from './hooks/useQuestionUpdates';
import { usePendingUpdates } from './hooks/usePendingUpdates';
import { toast } from 'sonner';

/**
 * Enhanced spaced repetition hook with error handling, memory leak prevention, 
 * and performance optimizations
 */
export function useSpacedRepetition(
  category: string, 
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  // Use the data hook to manage question data
  const {
    loading,
    error,
    dueQuestions,
    progress,
    fetchData,
    isMounted
  } = useSpacedRepetitionData(category, subcategory, options);
  
  // Manage pending updates
  const { 
    pendingUpdates, 
    addPendingUpdate, 
    clearPendingUpdates 
  } = usePendingUpdates();
  
  // Handle question updates
  const { submitAnswer: submitQuestionUpdate } = useQuestionUpdates();

  // Submit answer without immediate reload
  const submitAnswer = useCallback(async (questionId: string, score: number) => {
    if (!questionId || !isMounted.current) return;

    try {
      // Add to pending updates
      addPendingUpdate(questionId, score);
      
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      // Update progress in the background
      submitQuestionUpdate(questionId, score, currentProgress)
        .catch(err => {
          console.error('Background update error:', err);
          
          if (isMounted.current) {
            toast.error("Es gab ein Problem beim Speichern deines Fortschritts. Deine Antworten werden lokal zwischengespeichert.");
          }
        });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  }, [progress, addPendingUpdate, submitQuestionUpdate, isMounted]);

  // Function to apply all pending updates and reload questions
  const applyPendingUpdates = useCallback(async () => {
    if (pendingUpdates.length === 0 || !isMounted.current) return;
    
    try {
      console.log(`Applying ${pendingUpdates.length} pending updates`);
      
      // Ensure all updates are complete
      for (const {questionId, score} of pendingUpdates) {
        const currentProgress = progress.find(p => p.question_id === questionId);
        await submitQuestionUpdate(questionId, score, currentProgress);
      }
      
      // Clear pending updates
      clearPendingUpdates();
      
      // Reload questions
      await fetchData();
    } catch (error) {
      console.error('Error applying updates:', error);
      if (isMounted.current) {
        toast.error("Fehler beim Aktualisieren der Karten. Bitte versuche es später erneut.");
      }
    }
  }, [pendingUpdates, progress, submitQuestionUpdate, clearPendingUpdates, fetchData, isMounted]);

  // Reload questions function
  const reloadQuestions = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      await fetchData();
    } catch (error) {
      console.error('Error reloading questions:', error);
      if (isMounted.current) {
        toast.error("Fehler beim Neuladen der Karten. Bitte versuche es später erneut.");
      }
    }
  }, [fetchData, isMounted]);

  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions
  };
}
