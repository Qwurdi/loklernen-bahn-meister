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
  
  if (regulation_category && regulation_category !== "all") {
    // Include both "both" category and the specific one
    query = query.or(`regulation_category.eq.${regulation_category},regulation_category.eq.both,regulation_category.is.null`);
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

/**
 * Fetches specific questions by their IDs.
 * @param ids - An array of question IDs to fetch. These can be numbers or strings, will be converted to strings.
 * @param regulation_category - Optional regulation category to further filter.
 */
export async function getQuestionsByIds(ids: (number | string)[], regulation_category?: string) {
  if (!ids || ids.length === 0) {
    return [];
  }

  // Ensure all IDs are strings for Supabase .in() filter, especially if IDs are UUIDs or text.
  const stringIds = ids.map(id => String(id));

  let query = supabase
    .from('questions')
    .select('*')
    .in('id', stringIds); // Verwende stringIds

  if (regulation_category && regulation_category !== "all") {
    query = query.or(`regulation_category.eq.${regulation_category},regulation_category.eq.both,regulation_category.is.null`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching questions by IDs:", error);
    throw error;
  }
  
  return (data || []).map(transformQuestion);
}
