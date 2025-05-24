
import { supabase } from '@/integrations/supabase/client';
import { QuestionCategory } from '@/types/questions';
import { transformQuestion } from '../../utils';

/**
 * Optimized single query to fetch both progress and new questions
 * Uses JOINs instead of sequential queries for better performance
 */
export async function fetchOptimizedSessionQuestions(
  userId: string,
  category?: QuestionCategory | null,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 15,
  includeAllSubcategories: boolean = false
) {
  console.log("Optimized query: Loading session questions", {
    userId, category, subcategory, regulationCategory, batchSize, includeAllSubcategories
  });

  // Build the base query with a CTE for better performance
  let query = supabase.rpc('get_session_questions_optimized', {
    p_user_id: userId,
    p_category: category,
    p_subcategory: subcategory,
    p_regulation_category: regulationCategory,
    p_batch_size: batchSize,
    p_include_all_subcategories: includeAllSubcategories
  });

  const { data, error } = await query;

  if (error) {
    console.error("Optimized query error:", error);
    throw new Error(`Error fetching session questions: ${error.message}`);
  }

  return {
    progressQuestions: (data?.progress_questions || []).map(transformQuestion),
    newQuestions: (data?.new_questions || []).map(transformQuestion),
    totalAvailable: data?.total_available || 0
  };
}

/**
 * Optimized practice mode query
 */
export async function fetchOptimizedPracticeQuestions(
  category?: QuestionCategory | null,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 15,
  includeAllSubcategories: boolean = false
) {
  console.log("Optimized practice query:", {
    category, subcategory, regulationCategory, batchSize, includeAllSubcategories
  });

  let query = supabase.from('questions').select('*');
    
  // Apply filters efficiently using the new indexes
  if (category && !includeAllSubcategories) {
    query = query.eq('category', category);
  } else if (category && includeAllSubcategories) {
    query = query.eq('category', category);
  }
    
  if (subcategory) {
    query = query.eq('sub_category', subcategory);
  }
  
  if (regulationCategory !== "all") {
    query = query.or(`regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`);
  }

  // Use the new index for better performance
  query = query.order('id').limit(batchSize);

  const { data: questions, error } = await query;

  if (error) {
    console.error("Optimized practice query error:", error);
    throw new Error(`Error fetching practice questions: ${error.message}`);
  }

  return questions?.map(transformQuestion) || [];
}
