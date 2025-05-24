
import { supabase } from "@/integrations/supabase/client";
import { QuestionCategory } from "@/types/questions";
import { transformQuestion } from "./transformers";

/**
 * Fetches questions with optional filtering
 */
export async function fetchQuestions(category?: QuestionCategory, sub_category?: string, regulation_category?: string) {
  let query = supabase
    .from('questions')
    .select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (sub_category) {
    query = query.eq('sub_category', sub_category);
  }
  
  // Fixed regulation category filtering to handle spaces properly
  if (regulation_category && regulation_category !== "all") {
    query = query.or(`regulation_category.eq."${regulation_category}",regulation_category.eq.both,regulation_category.is.null`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  // Transform the data to match our application types
  return (data || []).map(transformQuestion);
}

/**
 * Fetches questions by regulation category
 */
export async function fetchRegulationCategoryQuestions(regulation_category: string) {
  return fetchQuestions(undefined, undefined, regulation_category);
}
