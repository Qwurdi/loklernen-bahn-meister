
import { supabase } from '@/integrations/supabase/client';
import { QuestionCategory } from '@/types/questions';
import { transformQuestion } from '../../utils';

/**
 * Optimized query to fetch both progress and new questions using standard queries
 * Instead of a custom RPC function, we use efficient standard queries with proper indexes
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

  try {
    // First, get due progress questions with efficient query
    const now = new Date().toISOString();
    let progressQuery = supabase
      .from('user_progress')
      .select(`
        *,
        questions!inner(*)
      `)
      .eq('user_id', userId)
      .lte('next_review_at', now);

    // Apply category filters
    if (category && !includeAllSubcategories) {
      progressQuery = progressQuery.eq('questions.category', category);
    } else if (category && includeAllSubcategories) {
      progressQuery = progressQuery.eq('questions.category', category);
    }
    
    if (subcategory) {
      progressQuery = progressQuery.eq('questions.sub_category', subcategory);
    }
    
    // Apply regulation filter if not "all" - Fixed to handle spaces properly
    if (regulationCategory !== "all") {
      progressQuery = progressQuery.or(
        `questions.regulation_category.eq."${regulationCategory}",questions.regulation_category.eq.both,questions.regulation_category.is.null`
      );
    }

    const { data: progressData, error: progressError } = await progressQuery.limit(batchSize);
    
    if (progressError) throw progressError;

    const progressQuestions = (progressData || []).map(p => transformQuestion(p.questions as any));
    
    // If we need more questions, get new ones
    let newQuestions: any[] = [];
    if (progressQuestions.length < batchSize) {
      const questionIdsWithProgress = (progressData || []).map(p => p.question_id);
      const neededNewQuestions = batchSize - progressQuestions.length;
      
      let newQuery = supabase.from('questions').select('*');
      
      if (questionIdsWithProgress.length > 0) {
        newQuery = newQuery.not('id', 'in', `(${questionIdsWithProgress.join(',')})`);
      }
      
      if (category && !includeAllSubcategories) {
        newQuery = newQuery.eq('category', category);
      } else if (category && includeAllSubcategories) {
        newQuery = newQuery.eq('category', category);
      }
      
      if (subcategory) {
        newQuery = newQuery.eq('sub_category', subcategory);
      }
      
      // Apply regulation filter if not "all" - Fixed to handle spaces properly
      if (regulationCategory !== "all") {
        newQuery = newQuery.or(`regulation_category.eq."${regulationCategory}",regulation_category.eq.both,regulation_category.is.null`);
      }

      const { data: newQuestionsData, error: newError } = await newQuery.limit(neededNewQuestions);
      
      if (newError) throw newError;
      
      newQuestions = (newQuestionsData || []).map(transformQuestion);
    }

    return {
      progressQuestions,
      newQuestions,
      totalAvailable: progressQuestions.length + newQuestions.length
    };
  } catch (error) {
    console.error("Optimized query error:", error);
    throw new Error(`Error fetching session questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
  
  // Apply regulation filter if not "all" - Fixed to handle spaces properly
  if (regulationCategory !== "all") {
    query = query.or(`regulation_category.eq."${regulationCategory}",regulation_category.eq.both,regulation_category.is.null`);
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
