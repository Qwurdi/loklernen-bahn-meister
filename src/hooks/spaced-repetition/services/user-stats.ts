
import { supabase } from '@/integrations/supabase/client';
import { calculateXpGain } from './score-calculation';
import { calculateStreakUpdate } from './streak-management';

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
    await updateExistingStats(userId, existingStats, score, currentDate, xpGain);
  } else {
    await createNewStats(userId, score, currentDate, xpGain);
  }
}

/**
 * Update existing stats
 */
async function updateExistingStats(
  userId: string,
  existingStats: any,
  score: number,
  currentDate: string,
  xpGain: number
) {
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
  updates.streak_days = calculateStreakUpdate(existingStats.last_activity_date, existingStats.streak_days);
  
  const { error: updateError } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', userId);
    
  if (updateError) {
    console.error("Error updating stats:", updateError);
    throw updateError;
  }

  return updates;
}

/**
 * Create new stats
 */
async function createNewStats(userId: string, score: number, currentDate: string, xpGain: number) {
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
