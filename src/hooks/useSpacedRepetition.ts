
import { useEffect, useState } from 'react';
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

export function useSpacedRepetition(category: QuestionCategory, subcategory?: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    if (!user) return;
    loadDueQuestions();
  }, [user, category, subcategory]);

  const loadDueQuestions = async () => {
    try {
      setLoading(true);
      
      // Fetch questions that are due for review
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*, questions(*)')
        .eq('user_id', user?.id)
        .eq('questions.category', category as QuestionCategory)
        .eq(subcategory ? 'questions.sub_category' : 'questions.sub_category', subcategory || '')
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true });

      if (progressError) throw progressError;

      // Also fetch questions that haven't been studied yet
      const { data: newQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('category', category as QuestionCategory)
        .eq(subcategory ? 'sub_category' : 'sub_category', subcategory || '')
        .not('id', 'in', (progressData || []).map(p => p.question_id));

      if (questionsError) throw questionsError;

      const transformedProgressQuestions = (progressData || []).map(p => transformQuestion(p.questions));
      const transformedNewQuestions = (newQuestions || []).map(q => transformQuestion(q));
      
      setDueQuestions([
        ...transformedProgressQuestions,
        ...transformedNewQuestions
      ]);
      setProgress(progressData || []);
    } catch (error) {
      console.error('Error loading due questions:', error);
    } finally {
      setLoading(false);
    }
  };

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

    const currentProgress = progress.find(p => p.question_id === questionId);
    const { interval_days, ease_factor, next_review_at } = calculateNextReview(score, currentProgress);

    try {
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
    }
  };

  return {
    loading,
    dueQuestions,
    progress,
    submitAnswer,
    reloadQuestions: loadDueQuestions
  };
}
