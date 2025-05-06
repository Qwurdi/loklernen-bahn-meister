import { supabase } from '@/integrations/supabase/client';
import { QuestionCategory } from '@/types/questions';
import { transformQuestion } from '../utils';

/**
 * Fetches user progress for questions that are due for review
 */
export async function fetchUserProgress(
  userId: string,
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  selectedCategories?: string[]
) {
  console.log("Loading due questions for user", userId, "with regulation", regulationCategory, "and subcategory", subcategory || "all");
  
  // First get progress data for questions that are due
  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select('*, questions(*)')
    .eq('user_id', userId)
    .lte('next_review_at', new Date().toISOString());

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    throw new Error(`Error fetching progress data: ${progressError.message}`);
  }

  // Filter the progress data by category and subcategory
  let filteredProgressData = progressData || [];
  console.log("Got progress data:", filteredProgressData.length, "items");
  
  // Filter by category
  filteredProgressData = filteredProgressData.filter(p => 
    p.questions?.category === category);
  
  // If we have selected categories, use them instead of a single subcategory
  if (selectedCategories && selectedCategories.length > 0) {
    filteredProgressData = filteredProgressData.filter(p => 
      selectedCategories.includes(p.questions?.sub_category));
  }
  // Otherwise, filter by subcategory if specified
  else if (subcategory) {
    filteredProgressData = filteredProgressData.filter(p => 
      p.questions?.sub_category === subcategory);
  }
  
  // Apply regulation filter if not "all"
  if (regulationCategory !== "all") {
    filteredProgressData = filteredProgressData.filter(p => 
      // Include if the regulation matches OR is "both" OR is not specified
      p.questions?.regulation_category === regulationCategory || 
      p.questions?.regulation_category === "both" || 
      !p.questions?.regulation_category);
  }
  
  console.log("Filtered progress data:", filteredProgressData.length, "items");

  return filteredProgressData;
}
