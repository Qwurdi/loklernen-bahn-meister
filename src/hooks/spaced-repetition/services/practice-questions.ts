import { supabase } from '@/integrations/supabase/client';
import { QuestionCategory } from '@/types/questions';
import { transformQuestion } from '../utils';

/**
 * Fetches questions for practice mode
 */
export async function fetchPracticeQuestions(
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 36,
  selectedCategories?: string[]
) {
  console.log("Practice mode: Fetching questions for category:", category, "subcategory:", subcategory, "regulation:", regulationCategory);
  
  let query = supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .limit(batchSize);
    
  // If we have selected categories, use them instead of a single subcategory
  if (selectedCategories && selectedCategories.length > 0) {
    query = query.in('sub_category', selectedCategories);
  }
  // Otherwise, filter by subcategory if specified
  else if (subcategory) {
    query = query.eq('sub_category', subcategory);
  }
  
  // Apply regulation filter if specified and not "all"
  if (regulationCategory !== "all") {
    query = query.or(`regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`);
  }

  const { data: questions, error: questionsError } = await query;

  if (questionsError) {
    console.error("Error fetching practice questions:", questionsError);
    throw new Error(`Error fetching practice questions: ${questionsError.message}`);
  }

  return questions?.map(transformQuestion) || [];
}
