
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult } from './types';
import { fetchOptimizedSessionQuestions, fetchOptimizedPracticeQuestions } from './services/questions/optimized-queries';
import { fetchQuestionsByBox, updateUserProgress, updateUserStats } from './services';

export function useOptimizedSpacedRepetition(
  category: QuestionCategory | null, 
  subcategory?: string | null,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<{questionId: string, score: number}[]>([]);
  
  const regulationCategory = options.regulationCategory || "all";
  const boxNumber = options.boxNumber;
  const batchSize = options.batchSize || 15;
  const includeAllSubcategories = options.includeAllSubcategories || false;
  
  const loadDueQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        // Practice mode - use optimized query
        const practiceQuestions = await fetchOptimizedPracticeQuestions(
          category as QuestionCategory,
          subcategory || undefined,
          regulationCategory,
          batchSize,
          includeAllSubcategories
        );
        setDueQuestions(practiceQuestions);
      } else if (options.boxNumber !== undefined) {
        // Box mode - existing logic
        const boxProgress = await fetchQuestionsByBox(
          user.id, 
          options.boxNumber, 
          options.regulationCategory || 'all',
          options.includeAllSubcategories || false
        );
        
        if (Array.isArray(boxProgress)) {
          const uniqueQuestionsMap = new Map<string, Question>();
          
          boxProgress.forEach(p => {
            if (p.questions && p.question_id) {
              const questionData = p.questions as any;
              uniqueQuestionsMap.set(p.question_id, questionData);
            }
          });
              
          const questionsFromBox = Array.from(uniqueQuestionsMap.values());
          setDueQuestions(questionsFromBox);
          setProgress(boxProgress);
        } else {
          setDueQuestions([]);
          setProgress([]);
        }
      } else {
        // Regular spaced repetition - use optimized query
        const result = await fetchOptimizedSessionQuestions(
          user.id,
          category as QuestionCategory,
          subcategory || undefined,
          regulationCategory,
          batchSize,
          includeAllSubcategories
        );
        
        // Combine progress and new questions
        const allQuestions = [
          ...result.progressQuestions,
          ...result.newQuestions
        ].slice(0, batchSize);
        
        setDueQuestions(allQuestions);
        // Note: We'll need to handle progress separately for the optimized version
        setProgress([]);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading questions'));
      setDueQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [user, category, subcategory, options.practiceMode, options.regulationCategory, options.boxNumber, options.batchSize, options.includeAllSubcategories]);

  useEffect(() => {
    loadDueQuestions();
  }, [loadDueQuestions]);

  // Submit answer without immediate reload
  const submitAnswer = async (questionId: string, score: number) => {
    if (!user) return;

    try {
      setPendingUpdates(prev => [...prev, {questionId, score}]);
      
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      updateUserProgress(user.id, questionId, score, currentProgress)
        .catch(err => console.error('Background update error:', err));
      
      updateUserStats(user.id, score)
        .catch(err => console.error('Background stats update error:', err));
        
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
    }
  };

  const applyPendingUpdates = async () => {
    if (!user || pendingUpdates.length === 0) return;
    
    setLoading(true);
    try {
      for (const {questionId, score} of pendingUpdates) {
        const currentProgress = progress.find(p => p.question_id === questionId);
        await updateUserProgress(user.id, questionId, score, currentProgress);
      }
      
      setPendingUpdates([]);
      await loadDueQuestions();
    } catch (error) {
      console.error('Error applying updates:', error);
      setError(error instanceof Error ? error : new Error('Unknown error applying updates'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions: loadDueQuestions
  };
}
