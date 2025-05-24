
import { supabase } from '@/integrations/supabase/client';
import { calculateXpGain } from './utils';

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
