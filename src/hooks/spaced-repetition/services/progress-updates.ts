
import { supabase } from '@/integrations/supabase/client';
import { calculateNewBoxNumber } from './score-calculation';
import { calculateNextReviewDate } from '../utils';
import { updateStreak } from './streak-management';

/**
 * Updates the user progress for a question
 */
export async function updateUserProgress(
  userId: string,
  questionId: string, 
  score: number,
  currentProgress?: any
) {
  console.log(`Updating progress for question ${questionId} with score ${score}`);

  // Determine whether we need to create or update progress
  if (currentProgress) {
    return updateExistingProgress(currentProgress, score);
  } else {
    return createNewProgress(userId, questionId, score);
  }
}

/**
 * Update existing progress entry
 */
async function updateExistingProgress(currentProgress: any, score: number) {
  const newBoxNumber = calculateNewBoxNumber(currentProgress.box_number, score);
  const nextReview = calculateNextReviewDate(newBoxNumber);

  // Update streak and counts based on score
  const streak = updateStreak(score, currentProgress.streak);
  let correctCount = currentProgress.correct_count;
  let incorrectCount = currentProgress.incorrect_count;

  if (score >= 4) {
    correctCount += 1;
  } else {
    incorrectCount += 1;
  }

  const { data, error } = await supabase
    .from('user_progress')
    .update({
      last_score: score,
      box_number: newBoxNumber,
      next_review_at: nextReview,
      last_reviewed_at: new Date().toISOString(),
      streak,
      repetition_count: currentProgress.repetition_count + 1,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      updated_at: new Date().toISOString()
    })
    .eq('id', currentProgress.id)
    .select();

  if (error) {
    console.error("Error updating progress:", error);
    throw new Error(`Error updating progress: ${error.message}`);
  }

  return data;
}

/**
 * Create new progress entry
 */
async function createNewProgress(userId: string, questionId: string, score: number) {
  const initialBox = score >= 4 ? 2 : 1;  // Start at box 2 for correct answers
  
  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      question_id: questionId,
      last_score: score,
      box_number: initialBox,
      last_reviewed_at: new Date().toISOString(),
      next_review_at: calculateNextReviewDate(initialBox),
      streak: score >= 4 ? 1 : 0,
      correct_count: score >= 4 ? 1 : 0,
      incorrect_count: score >= 4 ? 0 : 1
    })
    .select();

  if (error) {
    console.error("Error creating progress:", error);
    throw new Error(`Error creating progress: ${error.message}`);
  }

  return data;
}
