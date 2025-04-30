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
  
  // Default to 'all' if regulationCategory is not provided
  const regulationCategory = options.regulationCategory || "all";
  
  // Maximum number of questions to load at once
  const batchSize = 50;
  
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
      console.log(`Loading questions with category=${category}, subcategory=${subcategory}, regulation=${regulationCategory}, practice=${options.practiceMode}`);

      // Handle practice mode differently - just load questions without checking if they're due
      if (options.practiceMode) {
        let query = supabase
          .from('questions')
          .select('*')
          .eq('category', category)
          .limit(batchSize);
          
        if (subcategory) {
          query = query.eq('sub_category', subcategory);
        }
        
        // Apply regulation filter if specified and not "all"
        if (regulationCategory !== "all") {
          query = query.or(`regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`);
        }

        const { data: questions, error: questionsError } = await query;

        if (questionsError) {
          console.error("Error fetching practice questions:", questionsError);
          setError(new Error(`Error fetching practice questions: ${questionsError.message}`));
          return;
        }

        setDueQuestions(questions?.map(transformQuestion) || []);
        return;
      }
      
      // Regular spaced repetition mode - Load questions that are due for review
      console.log("Loading due questions for user", user.id, "with regulation", regulationCategory);
      
      // First get progress data for questions that are due
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString());

      if (progressError) {
        console.error("Error fetching progress data:", progressError);
        setError(new Error(`Error fetching progress data: ${progressError.message}`));
        return;
      }

      // Filter the progress data by category and subcategory
      let filteredProgressData = progressData || [];
      console.log("Got progress data:", filteredProgressData.length, "items");
      
      // Filter by category
      filteredProgressData = filteredProgressData.filter(p => 
        p.questions?.category === category);
      
      // Filter by subcategory if specified
      if (subcategory) {
        filteredProgressData = filteredProgressData.filter(p => 
          p.questions?.sub_category === subcategory);
      }
      
      // Apply regulation filter if not "all"
      if (regulationCategory !== "all") {
        filteredProgressData = filteredProgressData.filter(p => 
          p.questions?.regulation_category === regulationCategory || 
          p.questions?.regulation_category === "both" || 
          !p.questions?.regulation_category);
      }
      
      console.log("Filtered progress data:", filteredProgressData.length, "items");

      // Transform the questions from the progress data
      const questionsWithProgress = filteredProgressData
        .filter(p => p.questions) // Ensure questions exist
        .map(p => transformQuestion(p.questions));
        
      console.log("Questions with progress:", questionsWithProgress.length);

      // If we have enough questions with progress, no need to fetch new ones
      if (questionsWithProgress.length >= batchSize) {
        setDueQuestions(questionsWithProgress.slice(0, batchSize));
        setProgress(filteredProgressData);
        setLoading(false);
        return;
      }

      // Otherwise, fetch new questions (those without progress)
      // Get the IDs of questions that already have progress
      const questionIdsWithProgress = filteredProgressData
        .filter(p => p.questions?.id)
        .map(p => p.question_id);
        
      console.log("Question IDs with progress:", questionIdsWithProgress.length);

      // Build the query for new questions
      let newQuestionsQuery = supabase
        .from('questions')
        .select('*')
        .eq('category', category)
        .limit(batchSize);
        
      if (subcategory) {
        newQuestionsQuery = newQuestionsQuery.eq('sub_category', subcategory);
      }
      
      // Apply regulation filter if not "all"
      if (regulationCategory !== "all") {
        newQuestionsQuery = newQuestionsQuery.or(
          `regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`
        );
      }

      // FIXED: Instead of using the 'not in' operator which has limitations,
      // we'll fetch all questions and filter in memory
      const { data: newQuestionsData, error: newQuestionsError } = await newQuestionsQuery;
      
      if (newQuestionsError) {
        console.error("Error fetching new questions:", newQuestionsError);
        setError(new Error(`Error fetching new questions: ${newQuestionsError.message}`));
        return;
      }
      
      console.log("Fetched new questions:", newQuestionsData?.length);

      // Filter out questions that already have progress
      const newQuestions = newQuestionsData 
        ? newQuestionsData.filter(q => !questionIdsWithProgress.includes(q.id))
        : [];
        
      console.log("Filtered new questions:", newQuestions.length);

      // Combine progress questions and new questions, and limit to batch size
      const allQuestions = [
        ...questionsWithProgress,
        ...newQuestions.map(transformQuestion)
      ].slice(0, batchSize);
      
      console.log("Final questions count:", allQuestions.length);
      setDueQuestions(allQuestions);
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
      console.log(`Submitting answer for question ${questionId} with score ${score}, next review in ${interval_days} days`);

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

        if (error) {
          console.error("Error updating progress:", error);
          throw error;
        }
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

        if (error) {
          console.error("Error creating progress:", error);
          throw error;
        }
      }

      // Update user stats - first check if user has stats
      const { data: existingStats, error: statsCheckError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsCheckError && statsCheckError.code !== 'PGRST116') {
        console.error("Error checking user stats:", statsCheckError);
        throw statsCheckError;
      }
      
      // Calculate XP to add (10 points per score level)
      const xpToAdd = score * 10;
      
      if (existingStats) {
        // Update existing stats
        const { error: statsUpdateError } = await supabase.from('user_stats').update({
          last_activity_date: new Date().toISOString(),
          xp: existingStats.xp + xpToAdd,
          total_correct: existingStats.total_correct + (score >= 4 ? 1 : 0),
          total_incorrect: existingStats.total_incorrect + (score < 4 ? 1 : 0)
        }).eq('user_id', user.id);

        if (statsUpdateError) {
          console.error("Error updating stats:", statsUpdateError);
          throw statsUpdateError;
        }
      } else {
        // Create new stats record
        const { error: statsInsertError } = await supabase.from('user_stats').insert({
          user_id: user.id,
          last_activity_date: new Date().toISOString(),
          xp: xpToAdd,
          total_correct: score >= 4 ? 1 : 0,
          total_incorrect: score < 4 ? 1 : 0
        });

        if (statsInsertError) {
          console.error("Error creating stats:", statsInsertError);
          throw statsInsertError;
        }
      }

      // Reload questions to update the list
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
