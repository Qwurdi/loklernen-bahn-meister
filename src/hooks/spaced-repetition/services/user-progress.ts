import { supabase } from '@/integrations/supabase/client';
import { UserProgress } from '../types';
import { processAnswer } from '../utils';

/**
 * Updates the user's progress for a specific question
 */
export async function updateUserProgress(
  userId: string, 
  questionId: string, 
  score: number, 
  currentProgress?: UserProgress
) {
  // Convert score (0-5) to a binary correct/incorrect for the new system
  const isCorrect = score >= 4;
  
  // Calculate new box position and next review date
  const { box_number, streak, next_review_at } = processAnswer(isCorrect, currentProgress);
  
  console.log(`Submitting answer for question ${questionId}, correct: ${isCorrect}, box: ${box_number}, streak: ${streak}`);

  if (currentProgress) {
    // Update existing progress
    const { error } = await supabase
      .from('user_progress')
      .update({
        last_reviewed_at: new Date().toISOString(),
        next_review_at,
        box_number,
        streak,
        repetition_count: (currentProgress.repetition_count || 0) + 1,
        correct_count: isCorrect ? (currentProgress.correct_count || 0) + 1 : currentProgress.correct_count,
        incorrect_count: !isCorrect ? (currentProgress.incorrect_count || 0) + 1 : currentProgress.incorrect_count,
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
        box_number,
        streak,
        repetition_count: 1,
        correct_count: isCorrect ? 1 : 0,
        incorrect_count: !isCorrect ? 1 : 0,
        last_score: score
      });

    if (error) {
      console.error("Error creating progress:", error);
      throw error;
    }
  }

  return { userId, questionId, score, box_number, streak };
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

/**
 * Fetch questions due for review by box number
 */
export async function fetchQuestionsByBox(userId: string, boxNumber: number) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*, questions(*)')
    .eq('user_id', userId)
    .eq('box_number', boxNumber)
    .lte('next_review_at', new Date().toISOString());

  if (error) {
    console.error("Error fetching questions by box:", error);
    throw error;
  }

  return data || [];
}

/**
 * Get statistics about all boxes
 */
export async function getBoxesStats(userId: string) {
  // Get all user progress entries to analyze
  const { data: progressData, error } = await supabase
    .from('user_progress')
    .select('box_number')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching boxes stats:", error);
    throw error;
  }

  // Get counts for cards due in each box
  const { data: dueData, error: dueError } = await supabase
    .from('user_progress')
    .select('box_number')
    .eq('user_id', userId)
    .lte('next_review_at', new Date().toISOString());

  if (dueError) {
    console.error("Error fetching due boxes stats:", dueError);
    throw dueError;
  }

  // Transform into a more usable format - manually count items instead of using GROUP BY
  const boxStats = Array.from({ length: 5 }, (_, i) => ({
    boxNumber: i + 1,
    total: 0,
    due: 0
  }));

  // Fill in total counts
  (progressData || []).forEach(row => {
    const boxIndex = (row.box_number || 1) - 1;
    if (boxIndex >= 0 && boxIndex < 5) {
      boxStats[boxIndex].total += 1;
    }
  });

  // Fill in due counts
  (dueData || []).forEach(row => {
    const boxIndex = (row.box_number || 1) - 1;
    if (boxIndex >= 0 && boxIndex < 5) {
      boxStats[boxIndex].due += 1;
    }
  });

  return boxStats;
}
