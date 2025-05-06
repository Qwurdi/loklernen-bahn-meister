
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches questions for a specific box number
 */
export async function fetchQuestionsByBox(
  userId: string,
  boxNumber: number,
  regulationCategory: string = "all",
  selectedCategories?: string[]
) {
  console.log(`Fetching questions for user ${userId} in box ${boxNumber} with regulation ${regulationCategory}`);
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      questions(*)
    `)
    .eq('user_id', userId)
    .eq('box_number', boxNumber)
    .order('next_review_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching questions by box:", error);
    throw error;
  }
  
  // Filter by regulation if needed
  let filteredData = data || [];
  
  if (regulationCategory !== "all") {
    filteredData = filteredData.filter(p => 
      p.questions?.regulation_category === regulationCategory || 
      p.questions?.regulation_category === "both" || 
      !p.questions?.regulation_category);
  }
  
  // Filter by selected categories if specified
  if (selectedCategories && selectedCategories.length > 0) {
    filteredData = filteredData.filter(p => 
      selectedCategories.includes(p.questions?.sub_category));
  }
  
  console.log(`Found ${filteredData.length} questions in box ${boxNumber}`);
  
  return filteredData;
}
