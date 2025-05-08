
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/types/questions';
import { buildCategoryFilter } from './helpers';
import { transformQuestion } from '../utils';

/**
 * Fetches new questions that the user hasn't seen yet
 */
export async function fetchNewQuestions(
  categoryIdentifiers: string | string[],
  regulationCategory: string = "all",
  questionIdsWithProgress: string[] = [],
  batchSize: number = 36
): Promise<Question[]> {
  let newQuestionsQuery = supabase
    .from('questions')
    .select('*');

  const categoryFilterString = buildCategoryFilter(categoryIdentifiers);
  if (categoryFilterString) {
    newQuestionsQuery = newQuestionsQuery.or(categoryFilterString);
  } else {
    // If no categoryIdentifiers are provided, do not fetch new questions
    console.log("fetchNewQuestions: No category identifiers provided. Returning empty array.");
    return []; 
  }
    
  if (regulationCategory !== "all") {
    newQuestionsQuery = newQuestionsQuery.or(
      `regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`
    );
  }

  if (questionIdsWithProgress.length > 0) {
    newQuestionsQuery = newQuestionsQuery.not('id', 'in', `(${questionIdsWithProgress.join(',')})`);
  }
  
  newQuestionsQuery = newQuestionsQuery.limit(batchSize);

  const { data: newQuestionsData, error: newQuestionsError } = await newQuestionsQuery;
  
  if (newQuestionsError) {
    console.error("Error fetching new questions:", newQuestionsError);
    throw new Error(`Error fetching new questions: ${newQuestionsError.message}`);
  }
  
  return (newQuestionsData || []).map(transformQuestion);
}

/**
 * Fetches questions for practice mode
 */
export async function fetchPracticeQuestions(
  categoryIdentifiers: string | string[],
  regulationCategory: string = "all",
  batchSize: number = 36
): Promise<Question[]> {
  let query = supabase
    .from('questions')
    .select('*');

  const categoryFilterString = buildCategoryFilter(categoryIdentifiers);
  if (categoryFilterString) {
    query = query.or(categoryFilterString);
  } else {
    console.warn("fetchPracticeQuestions: No valid category identifiers to filter by. Returning empty.");
    return [];
  }
    
  if (regulationCategory !== "all") {
    query = query.or(`regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`);
  }

  query = query.limit(batchSize);

  const { data: questions, error: questionsError } = await query;

  if (questionsError) {
    console.error("Error fetching practice questions:", questionsError);
    throw new Error(`Error fetching practice questions: ${questionsError.message}`);
  }

  return (questions || []).map(transformQuestion);
}
