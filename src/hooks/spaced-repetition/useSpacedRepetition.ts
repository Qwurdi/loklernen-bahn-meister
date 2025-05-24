
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult } from './types';
import { transformQuestion } from './utils';
import {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox,
  updateUserProgress,
  updateUserStats
} from './services';

export function useSpacedRepetition(
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
        // For non-authenticated users, load questions in practice mode
        console.log(`Loading practice questions for guest user with category=${category}, subcategory=${subcategory}, regulation=${regulationCategory}, batchSize=${batchSize}, includeAllSubcategories=${includeAllSubcategories}`);
        const practiceQuestions = await fetchPracticeQuestions(
          category as QuestionCategory,
          subcategory || undefined,
          regulationCategory,
          batchSize,
          includeAllSubcategories
        );
        setDueQuestions(practiceQuestions);
      } else {
        // Logic for authenticated users
        console.log(`Loading questions for authenticated user: category=${category}, subcategory=${subcategory}, regulation=${options.regulationCategory}, practiceMode=${options.practiceMode}, boxNumber=${options.boxNumber}, batchSize=${options.batchSize}, includeAllSubcategories=${options.includeAllSubcategories}`);

        if (options.practiceMode) {
          const practiceQuestions = await fetchPracticeQuestions(
            category as QuestionCategory,
            subcategory || undefined, 
            regulationCategory, 
            batchSize,
            includeAllSubcategories
          );
          setDueQuestions(practiceQuestions);
        } else if (options.boxNumber !== undefined) {
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
                uniqueQuestionsMap.set(p.question_id, transformQuestion(questionData));
              }
            });
              
            const questionsFromBox = Array.from(uniqueQuestionsMap.values());
            
            console.log(`Loaded ${questionsFromBox.length} unique questions from box ${options.boxNumber}`);
            setDueQuestions(questionsFromBox);
            setProgress(boxProgress);
          } else {
            console.warn("boxProgress is not an array:", boxProgress);
            setDueQuestions([]);
            setProgress([]);
          }
        } else {
          // Optimized regular spaced repetition mode
          const now = new Date().toISOString();
          
          // Use a more efficient query that gets both progress and new questions
          let progressQuery = supabase
            .from('user_progress')
            .select(`
              *,
              questions!inner(*)
            `)
            .eq('user_id', user.id)
            .lte('next_review_at', now);

          // Apply category filters
          if (category && !includeAllSubcategories) {
            progressQuery = progressQuery.eq('questions.category', category);
          } else if (category && includeAllSubcategories) {
            progressQuery = progressQuery.eq('questions.category', category);
          }
          
          if (subcategory) {
            progressQuery = progressQuery.eq('questions.sub_category', subcategory);
          }
          
          if (regulationCategory !== "all") {
            progressQuery = progressQuery.or(
              `questions.regulation_category.eq.${regulationCategory},questions.regulation_category.eq.both,questions.regulation_category.is.null`
            );
          }

          const { data: progressData, error: progressError } = await progressQuery.limit(batchSize);
          
          if (progressError) throw progressError;

          const questionsWithProgress = progressData || [];
          const progressQuestions = questionsWithProgress.map(p => transformQuestion(p.questions));
          
          if (questionsWithProgress.length >= batchSize) {
            setDueQuestions(progressQuestions);
            setProgress(questionsWithProgress);
          } else {
            // Get new questions to fill the batch
            const questionIdsWithProgress = questionsWithProgress.map(p => p.question_id);
            const neededNewQuestions = batchSize - questionsWithProgress.length;
            
            const newQuestions = await fetchNewQuestions(
              category as QuestionCategory,
              subcategory || undefined, 
              regulationCategory, 
              questionIdsWithProgress, 
              neededNewQuestions,
              includeAllSubcategories
            );

            const allQuestions = [
              ...progressQuestions,
              ...newQuestions.map(transformQuestion)
            ].slice(0, batchSize);
            
            setDueQuestions(allQuestions);
            setProgress(questionsWithProgress);
          }
        }
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
