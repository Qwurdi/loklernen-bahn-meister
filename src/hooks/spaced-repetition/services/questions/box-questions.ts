
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches questions for a specific box number
 */
export async function fetchQuestionsByBox(
  userId: string,
  boxNumber: number,
  regulationCategory: string = "all",
  includeAllSubcategories: boolean = false
) {
  console.log(`Fetching questions for user ${userId} in box ${boxNumber} with regulation ${regulationCategory}`);
  console.log("Include all subcategories:", includeAllSubcategories);
  
  // First get the latest progress entries from the stored procedure
  const { data: progressData, error: progressError } = await supabase
    .rpc('get_latest_progress_by_box', { 
      p_user_id: userId, 
      p_box_number: boxNumber 
    });
    
  if (progressError) {
    console.error("Error fetching questions by box:", progressError);
    throw progressError;
  }
  
  // Since the stored procedure joins the questions data as JSON
  if (!progressData || !Array.isArray(progressData) || progressData.length === 0) {
    return [];
  }
  
  // Filter by regulation if needed
  let filteredData = progressData;
  
  if (regulationCategory !== "all") {
    filteredData = filteredData.filter(p => {
      // Progress entries from stored procedure may have a different structure
      // Handle potential missing properties safely with optional chaining
      const questionData = p.questions || p;
      return questionData?.regulation_category === regulationCategory || 
             questionData?.regulation_category === "both" || 
             !questionData?.regulation_category;
    });
  }
  
  console.log(`Found ${filteredData.length} questions in box ${boxNumber} after filtering`);
  
  return filteredData;
}
