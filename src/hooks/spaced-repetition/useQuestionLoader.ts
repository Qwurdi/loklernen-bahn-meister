
import { useState, useCallback } from 'react';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress } from './types';
import { supabase } from '@/integrations/supabase/client';
import { transformQuestion } from './utils';
import {
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox
} from './services';

export function useQuestionLoader(
  user: any,
  category: QuestionCategory | null, 
  subcategory?: string | null,
  options: SpacedRepetitionOptions = {}
) {
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  const regulationCategory = options.regulationCategory || "all";
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

  return {
    loading,
    error,
    dueQuestions,
    progress,
    loadDueQuestions,
    setError
  };
}
