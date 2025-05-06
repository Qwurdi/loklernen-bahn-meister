
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult } from './types';
import { useLoadQuestions } from './hooks/useLoadQuestions';
import { useQuestionUpdates } from './hooks/useQuestionUpdates';
import { usePendingUpdates } from './hooks/usePendingUpdates';

export function useSpacedRepetition(
  category: string, 
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  // Use specialized hooks for different concerns
  const { loadQuestions, loadingQuestions, questionsError } = useLoadQuestions(
    user?.id, 
    category as QuestionCategory, // Cast to QuestionCategory type
    subcategory, 
    options
  );
  
  const { pendingUpdates, addPendingUpdate, clearPendingUpdates } = usePendingUpdates();
  
  const { submitAnswer: submitQuestionUpdate } = useQuestionUpdates(user?.id);
  
  // Load questions when component mounts or dependencies change
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user) {
          setDueQuestions([]);
          setProgress([]);
          return;
        }
        
        const { questions, progressData } = await loadQuestions();
        
        setDueQuestions(questions);
        setProgress(progressData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading questions'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [user, loadQuestions]);
  
  // Update error state from child hooks
  useEffect(() => {
    if (questionsError) {
      setError(questionsError);
    }
  }, [questionsError]);

  // Submit answer without immediate reload
  const submitAnswer = async (questionId: string, score: number) => {
    if (!user) return;

    try {
      // Add to pending updates
      addPendingUpdate(questionId, score);
      
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      // Update progress in the background, don't await the result
      submitQuestionUpdate(questionId, score, currentProgress)
        .catch(err => {
          console.error('Background update error:', err);
        });
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
    }
  };

  // Function to apply all pending updates and reload questions
  const applyPendingUpdates = async () => {
    if (!user || pendingUpdates.length === 0) return;
    
    setLoading(true);
    try {
      // Ensure all updates are complete
      for (const {questionId, score} of pendingUpdates) {
        const currentProgress = progress.find(p => p.question_id === questionId);
        await submitQuestionUpdate(questionId, score, currentProgress);
      }
      
      // Clear pending updates
      clearPendingUpdates();
      
      // Reload questions
      const { questions, progressData } = await loadQuestions();
      setDueQuestions(questions);
      setProgress(progressData);
    } catch (error) {
      console.error('Error applying updates:', error);
      setError(error instanceof Error ? error : new Error('Unknown error applying updates'));
    } finally {
      setLoading(false);
    }
  };

  // Reload questions function
  const reloadQuestions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { questions, progressData } = await loadQuestions();
      setDueQuestions(questions);
      setProgress(progressData);
    } catch (error) {
      console.error('Error reloading questions:', error);
      setError(error instanceof Error ? error : new Error('Unknown error reloading questions'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading: loading || loadingQuestions,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions
  };
}
