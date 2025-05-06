import { supabase } from '@/integrations/supabase/client';
import { QuestionCategory } from '@/types/questions';

/**
 * Fetches new questions that the user hasn't seen yet
 */
export async function fetchNewQuestions(
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  questionIdsWithProgress: string[] = [],
  batchSize: number = 36,
  selectedCategories?: string[]
) {
  console.log("Fetching new questions for category:", category, "subcategory:", subcategory, "regulation:", regulationCategory);
  // Build the query for new questions
  let newQuestionsQuery = supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .limit(batchSize);
    
  // If we have selected categories, use them instead of a single subcategory
  if (selectedCategories && selectedCategories.length > 0) {
    newQuestionsQuery = newQuestionsQuery.in('sub_category', selectedCategories);
  }
  // Otherwise, filter by subcategory if specified
  else if (subcategory) {
    newQuestionsQuery = newQuestionsQuery.eq('sub_category', subcategory);
  }
  
  // Apply regulation filter if not "all"
  if (regulationCategory !== "all") {
    newQuestionsQuery = newQuestionsQuery.or(
      `regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`
    );
  }

  const { data: newQuestionsData, error: newQuestionsError } = await newQuestionsQuery;
  
  if (newQuestionsError) {
    console.error("Error fetching new questions:", newQuestionsError);
    throw new Error(`Error fetching new questions: ${newQuestionsError.message}`);
  }
  
  console.log("Fetched new questions:", newQuestionsData?.length);

  // Filter out questions that already have progress
  const newQuestions = newQuestionsData 
    ? newQuestionsData.filter(q => !questionIdsWithProgress.includes(q.id))
    : [];
    
  console.log("Filtered new questions:", newQuestions.length);

  return newQuestions;
}
