import { supabase } from '@/integrations/supabase/client';
import { transformQuestion } from '../utils';

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

/**
 * Updates the user stats for a question
 */
export async function updateUserStats(userId: string, score: number) {
  console.log(`Updating stats for user ${userId} with score ${score}`);
  
  // Get current date for last activity
  const currentDate = new Date().toISOString().split('T')[0];  // Format as YYYY-MM-DD
  
  // Calculate XP gained (more XP for higher scores)
  const xpGain = calculateXpGain(score);
  
  // First try to update existing stats
  const { data: existingStats, error: fetchError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (fetchError) {
    console.error("Error fetching stats:", fetchError);
    throw fetchError;
  }
  
  if (existingStats) {
    // Update existing stats
    const updates: any = {
      last_activity_date: currentDate,
      updated_at: new Date().toISOString(),
      xp: existingStats.xp + xpGain
    };
    
    // Update correct/incorrect counts based on score
    if (score >= 4) {
      updates.total_correct = existingStats.total_correct + 1;
    } else {
      updates.total_incorrect = existingStats.total_incorrect + 1;
    }
    
    // Update streak if needed
    const lastActivityDate = new Date(existingStats.last_activity_date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (
      lastActivityDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0] ||
      lastActivityDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]
    ) {
      if (lastActivityDate.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
        updates.streak_days = existingStats.streak_days + 1;
      }
    } else {
      updates.streak_days = 1; // Reset streak if not consecutive
    }
    
    const { error: updateError } = await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId);
      
    if (updateError) {
      console.error("Error updating stats:", updateError);
      throw updateError;
    }
  } else {
    // Create new stats entry
    const { error: insertError } = await supabase
      .from('user_stats')
      .insert({
        user_id: userId,
        total_correct: score >= 4 ? 1 : 0,
        total_incorrect: score >= 4 ? 0 : 1,
        last_activity_date: currentDate,
        streak_days: 1,
        xp: xpGain
      });
      
    if (insertError) {
      console.error("Error creating stats:", insertError);
      throw insertError;
    }
  }
}

// Helper function to calculate new box number based on score
function calculateNewBoxNumber(currentBox: number, score: number): number {
  if (score <= 2) {
    // Failed recall, move back to box 1
    return 1;
  } else if (score === 3) {
    // Difficult recall, stay in current box or move forward cautiously
    return Math.min(currentBox + 1, 5);  // Maximum box is 5
  } else {
    // Good recall, move forward
    return Math.min(currentBox + 1, 5);  // Maximum box is 5
  }
}

// Helper function to calculate next review date based on box number
function calculateNextReviewDate(boxNumber: number): string {
  const now = new Date();
  
  switch (boxNumber) {
    case 1:
      // Box 1: Review after 1 day
      now.setDate(now.getDate() + 1);
      break;
    case 2:
      // Box 2: Review after 3 days
      now.setDate(now.getDate() + 3);
      break;
    case 3:
      // Box 3: Review after 7 days
      now.setDate(now.getDate() + 7);
      break;
    case 4:
      // Box 4: Review after 14 days
      now.setDate(now.getDate() + 14);
      break;
    case 5:
      // Box 5: Review after 30 days
      now.setDate(now.getDate() + 30);
      break;
    default:
      // Fallback to 1 day
      now.setDate(now.getDate() + 1);
  }
  
  return now.toISOString();
}

// Helper function to calculate XP gain based on score
function calculateXpGain(score: number): number {
  // Base XP is 10
  const baseXP = 10;
  
  // Apply multiplier based on score
  switch (score) {
    case 0:
    case 1:
      return 5;  // Very little XP for very poor recalls
    case 2:
      return 8;  // Modest XP for poor recalls
    case 3:
      return baseXP;  // Standard XP for okay recalls
    case 4:
      return baseXP * 1.2;  // 20% bonus for good recalls
    case 5:
      return baseXP * 1.5;  // 50% bonus for perfect recalls
    default:
      return baseXP;
  }
}
