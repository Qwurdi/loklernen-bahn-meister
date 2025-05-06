
import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult } from '../types';
import { useLoadQuestions } from './useLoadQuestions';
import { useQuestionUpdates } from './useQuestionUpdates';
import { usePendingUpdates } from './usePendingUpdates';
import { useSafeState } from './useSafeState';
import { toast } from 'sonner';

/**
 * Core hook that handles the main spaced repetition functionality
 */
export function useSpacedRepetitionCore(
  category: string, 
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  const { user } = useAuth();
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  
  const { safeSetState: setLoading, state: loading } = useSafeState(true);
  const { safeSetState: setError, state: error } = useSafeState<Error | null>(null);
  const { safeSetState: setDueQuestions, state: dueQuestions } = useSafeState<Question[]>([]);
  const { safeSetState: setProgress, state: progress } = useSafeState<UserProgress[]>([]);
  
  // Use specialized hooks for different concerns
  const { 
    loadQuestions, 
    loadingQuestions, 
    questionsError, 
    cleanup: cleanupQuestions 
  } = useLoadQuestions(
    user?.id, 
    category as QuestionCategory,
    subcategory, 
    options
  );
  
  const { 
    pendingUpdates, 
    addPendingUpdate, 
    clearPendingUpdates 
  } = usePendingUpdates();
  
  const { submitAnswer: submitQuestionUpdate } = useQuestionUpdates(user?.id);

  // Submit answer without immediate reload
  const submitAnswer = useCallback(async (questionId: string, score: number) => {
    if (!user || !isMounted.current) return;

    try {
      // Validate questionId
      if (!questionId) {
        console.error('Invalid question ID in submitAnswer');
        return;
      }
      
      // Add to pending updates
      addPendingUpdate(questionId, score);
      
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      // Update progress in the background, don't await the result
      submitQuestionUpdate(questionId, score, currentProgress)
        .catch(err => {
          console.error('Background update error:', err);
          
          // Show error toast only for critical errors
          if (isMounted.current) {
            toast.error("Es gab ein Problem beim Speichern deines Fortschritts. Deine Antworten werden lokal zwischengespeichert.");
          }
        });
    } catch (error) {
      console.error('Error submitting answer:', error);
      if (isMounted.current) {
        setError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
      }
    }
  }, [user, progress, addPendingUpdate, submitQuestionUpdate, setError]);

  // Function to apply all pending updates and reload questions
  const applyPendingUpdates = useCallback(async () => {
    if (!user || pendingUpdates.length === 0 || !isMounted.current) return;
    
    setLoading(true);
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
      const { questions, progressData } = await loadQuestions();
      
      if (isMounted.current) {
        setDueQuestions(questions);
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error applying updates:', error);
      if (isMounted.current) {
        setError(error instanceof Error ? error : new Error('Unknown error applying updates'));
        toast.error("Fehler beim Aktualisieren der Karten. Bitte versuche es später erneut.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user, pendingUpdates, progress, submitQuestionUpdate, clearPendingUpdates, loadQuestions, 
      setLoading, setDueQuestions, setProgress, setError]);

  // Reload questions function
  const reloadQuestions = useCallback(async () => {
    if (!user || !isMounted.current) return;
    
    setLoading(true);
    try {
      const { questions, progressData } = await loadQuestions();
      
      if (isMounted.current) {
        setDueQuestions(questions);
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error reloading questions:', error);
      if (isMounted.current) {
        setError(error instanceof Error ? error : new Error('Unknown error reloading questions'));
        toast.error("Fehler beim Neuladen der Karten. Bitte versuche es später erneut.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user, loadQuestions, setLoading, setDueQuestions, setProgress, setError]);

  return {
    loading: loading || loadingQuestions,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions,
    isMounted,
    cleanupQuestions
  };
}
