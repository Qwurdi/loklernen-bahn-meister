
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReviewDate } from './utils';

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

  try {
    // Check if progress already exists for this user and question combination
    if (!currentProgress) {
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Error checking for existing progress:", fetchError);
        throw fetchError;
      }
      
      // Use existing progress if found
      if (existingProgress) {
        console.log("Found existing progress record, using that instead of creating new");
        currentProgress = existingProgress;
      }
    }
    
    // Determine whether we need to create or update progress
    if (currentProgress) {
      // Update existing progress
      const newBoxNumber = calculateNewBoxNumber(currentProgress.box_number, score);
      const nextReview = calculateNextReviewDate(newBoxNumber);

      // Update streak and counts based on score
      let streak = currentProgress.streak;
      let correctCount = currentProgress.correct_count;
      let incorrectCount = currentProgress.incorrect_count;

      if (score >= 4) {
        // For correct answers (scores >= 4), increase streak and correct count
        streak += 1;
        correctCount += 1;
      } else {
        // For incorrect answers, reset streak and increase incorrect count
        streak = 0;
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
    } else {
      // Create new progress entry
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          question_id: questionId,
          last_score: score,
          box_number: score >= 4 ? 2 : 1,  // Start at box 2 for correct answers
          last_reviewed_at: new Date().toISOString(),
          next_review_at: calculateNextReviewDate(score >= 4 ? 2 : 1),
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
  } catch (err) {
    console.error('Error in updateUserProgress:', err);
    throw err;
  }
}
