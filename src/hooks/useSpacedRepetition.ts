import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { transformAnswers } from '@/api/questions';

interface UserProgress {
  id: string;
  question_id: string;
  last_reviewed_at: string;
  next_review_at: string;
  ease_factor: number;
  interval_days: number;
  repetition_count: number;
  correct_count: number;
  incorrect_count: number;
  last_score: number;
}

// Helper function to transform database questions to application questions
function transformQuestion(dbQuestion: any): Question {
  return {
    ...dbQuestion,
    answers: transformAnswers(dbQuestion.answers)
  };
}

interface SpacedRepetitionOptions {
  practiceMode?: boolean;
  regulationCategory?: string;
}

export function useSpacedRepetition(
  category: QuestionCategory, 
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const regulationCategory = options.regulationCategory || "all";
  const batchSize = 50; // Limit the number of questions to process at once

  // Move loadDueQuestions to useCallback to avoid recreation on every render
  const loadDueQuestions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setDueQuestions([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      if (options.practiceMode) {
        // In practice mode, load questions with pagination for better performance
        let query = supabase
          .from('questions')
          .select('*')
          .eq('category', category)
          .limit(batchSize);
          
        if (subcategory) {
          query = query.eq('sub_category', subcategory);
        }

        const { data: questions, error: questionsError } = await query;

        if (questionsError) {
          setError(new Error(`Error fetching practice questions: ${questionsError.message}`));
          return;
        }

        // Filter by regulation category if specified
        let filteredQuestions = questions || [];
        if (regulationCategory !== "all") {
          filteredQuestions = filteredQuestions.filter(q => 
            q.regulation_category === regulationCategory || 
            q.regulation_category === "both" || 
            q.regulation_category === undefined
          );
        }

        setDueQuestions(filteredQuestions.map(transformQuestion));
        return;
      }
      
      // Regular spaced repetition mode
      // Fetch questions that are due for review
      // Use safe filter approach instead of 'in' operator with large arrays
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .eq('questions.category', category)
        .lte('next_review_at', new Date().toISOString())
        .limit(batchSize);

      if (progressError) {
        setError(new Error(`Error fetching progress data: ${progressError.message}`));
        return;
      }

      // Apply subcategory filter
      let filteredProgressData = progressData || [];
      if (subcategory) {
        filteredProgressData = filteredProgressData.filter(p => 
          p.questions.sub_category === subcategory);
      }

      // Filter by regulation category if specified
      if (regulationCategory !== "all") {
        filteredProgressData = filteredProgressData.filter(p => 
          p.questions.regulation_category === regulationCategory || 
          p.questions.regulation_category === "both" || 
          p.questions.regulation_category === undefined
        );
      }

      // Get IDs of questions with progress
      const questionIdsWithProgress = filteredProgressData.map(p => p.question_id);

      // Build query for new questions (those without progress)
      let newQuestionsQuery = supabase
        .from('questions')
        .select('*')
        .eq('category', category)
        .limit(batchSize);
        
      if (subcategory) {
        newQuestionsQuery = newQuestionsQuery.eq('sub_category', subcategory);
      }

      // Handle question IDs with progress - use a different approach for large arrays
      if (questionIdsWithProgress.length > 0) {
        // For small arrays, use 'not in'
        if (questionIdsWithProgress.length < 10) {
          newQuestionsQuery = newQuestionsQuery.not('id', 'in', questionIdsWithProgress);
        } else {
          // For larger arrays, fetch all and filter in memory (less efficient but more reliable)
          // We limit the number to avoid processing too many questions
        }
      }

      // Apply regulation category filter
      if (regulationCategory !== "all") {
        newQuestionsQuery = newQuestionsQuery.or(
          `regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`
        );
      }

      const { data: newQuestions, error: newQuestionsError } = await newQuestionsQuery;
      
      if (newQuestionsError) {
        setError(new Error(`Error fetching new questions: ${newQuestionsError.message}`));
        return;
      }

      // Filter out questions that already have progress
      const filteredNewQuestions = newQuestions ? 
        newQuestions.filter(q => !questionIdsWithProgress.includes(q.id)) :
        [];

      const transformedProgressQuestions = filteredProgressData.map(p => transformQuestion(p.questions));
      const transformedNewQuestions = filteredNewQuestions.map(q => transformQuestion(q));
      
      setDueQuestions([...transformedProgressQuestions, ...transformedNewQuestions].slice(0, batchSize));
      setProgress(filteredProgressData);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError(error instanceof Error ? error : new Error('Unknown error loading questions'));
    } finally {
      setLoading(false);
    }
  }, [user, category, subcategory, options.practiceMode, regulationCategory]);

  useEffect(() => {
    loadDueQuestions();
  }, [loadDueQuestions]);

  const calculateNextReview = (score: number, currentProgress?: UserProgress) => {
    const baseEaseFactor = currentProgress?.ease_factor || 2.5;
    const baseInterval = currentProgress?.interval_days || 1;

    // Adjust ease factor based on performance (0-5 scale)
    const newEaseFactor = baseEaseFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));

    // Calculate new interval
    let newInterval = baseInterval;
    if (score >= 4) { // Good response
      if (currentProgress?.repetition_count === 0) {
        newInterval = 1;
      } else if (currentProgress?.repetition_count === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(baseInterval * newEaseFactor);
      }
    } else if (score >= 2) { // Hard response
      newInterval = Math.max(1, Math.round(baseInterval * 1.2));
    } else { // Wrong response
      newInterval = 1;
    }

    return {
      interval_days: newInterval,
      ease_factor: Math.max(1.3, newEaseFactor),
      next_review_at: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  const submitAnswer = async (questionId: string, score: number) => {
    if (!user) return;

    try {
      const currentProgress = progress.find(p => p.question_id === questionId);
      const { interval_days, ease_factor, next_review_at } = calculateNextReview(score, currentProgress);

      if (currentProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('user_progress')
          .update({
            last_reviewed_at: new Date().toISOString(),
            next_review_at,
            ease_factor,
            interval_days,
            repetition_count: (currentProgress.repetition_count || 0) + 1,
            correct_count: score >= 4 ? (currentProgress.correct_count || 0) + 1 : currentProgress.correct_count,
            incorrect_count: score < 4 ? (currentProgress.incorrect_count || 0) + 1 : currentProgress.incorrect_count,
            last_score: score
          })
          .eq('id', currentProgress.id);

        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            question_id: questionId,
            last_reviewed_at: new Date().toISOString(),
            next_review_at,
            ease_factor,
            interval_days,
            repetition_count: 1,
            correct_count: score >= 4 ? 1 : 0,
            incorrect_count: score < 4 ? 1 : 0,
            last_score: score
          });

        if (error) throw error;
      }

      // Update user stats
      const { error: statsError } = await supabase.from('user_stats').upsert({
        user_id: user.id,
        xp: score * 10, // Award XP based on score
        last_activity_date: new Date().toISOString(),
        total_correct: score >= 4 ? 1 : 0,
        total_incorrect: score < 4 ? 1 : 0
      }, {
        onConflict: 'user_id',
        count: 'exact'
      });

      if (statsError) throw statsError;

      // Reload questions
      await loadDueQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
    }
  };

  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    reloadQuestions: loadDueQuestions
  };
}
