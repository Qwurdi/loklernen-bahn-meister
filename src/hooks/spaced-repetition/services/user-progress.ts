
import { supabase } from '@/integrations/supabase/client';
import { UserProgress } from '../types';
import { calculateNextReview } from '../utils';

/**
 * Updates the user's progress for a specific question
 */
export async function updateUserProgress(
  userId: string, 
  questionId: string, 
  score: number, 
  currentProgress?: UserProgress
) {
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
        user_id: userId,
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

  return { userId, questionId, score };
}

/**
 * Updates the user's statistics
 */
export async function updateUserStats(userId: string, score: number) {
  // Update user stats - first check if user has stats
  const { data: existingStats, error: statsCheckError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
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
    }).eq('user_id', userId);

    if (statsUpdateError) {
      console.error("Error updating stats:", statsUpdateError);
      throw statsUpdateError;
    }
  } else {
    // Create new stats record
    const { error: statsInsertError } = await supabase.from('user_stats').insert({
      user_id: userId,
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
}
