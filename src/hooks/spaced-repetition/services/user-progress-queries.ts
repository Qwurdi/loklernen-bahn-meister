
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/types/questions';
import { UserProgress } from '../types';
import { transformQuestion } from '../utils';
import { buildCategoryFilter } from './helpers';

/**
 * Fetches user progress for questions with filtering options
 */
export async function fetchUserProgress(
  userId: string,
  categoryIdentifiers: string | string[] = [],
  regulationCategory: string = "all"
): Promise<(UserProgress & { questions: Question | null })[]> {
  const now = new Date().toISOString();
  let query = supabase
    .from('user_progress')
    .select('*, questions!inner(*)') // Use !inner to ensure questions exist and match the filter
    .eq('user_id', userId);

  // Apply filter for due questions if needed
  if (arguments[3] === true) { // Optional parameter for due questions only
    query = query.lte('next_review_at', now);
  }

  const categoryFilterString = buildCategoryFilter(categoryIdentifiers);
  if (categoryFilterString) {
    // Apply category filter only if categoryIdentifiers are provided
    query = query.or(categoryFilterString, { referencedTable: 'questions' });
  }
  
  if (regulationCategory !== "all") {
    query = query.or(
      `questions.regulation_category.eq.${regulationCategory},questions.regulation_category.eq.both,questions.regulation_category.is.null`,
      { foreignTable: 'questions' }
    );
  }
  
  const { data: progressData, error: progressError } = await query;

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    throw new Error(`Error fetching progress data: ${progressError.message}`);
  }
  
  // Transform the joined questions
  return (progressData || []).map(item => ({
    ...item,
    questions: item.questions ? transformQuestion(item.questions) : null
  }));
}

/**
 * Fetches questions for a specific box number
 */
export async function fetchQuestionsByBox(
  userId: string,
  boxNumber: number,
  regulationCategory: string = "all"
): Promise<(UserProgress & { questions: Question | null })[]> {
  console.log(`Fetching questions for user ${userId} in box ${boxNumber} with regulation ${regulationCategory}`);
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      questions!inner(*)
    `)
    .eq('user_id', userId)
    .eq('box_number', boxNumber)
    .order('next_review_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching questions by box:", error);
    throw error;
  }
  
  let filteredData = data || [];
  
  if (regulationCategory !== "all") {
    filteredData = filteredData.filter(p => 
      p.questions?.regulation_category === regulationCategory || 
      p.questions?.regulation_category === "both" || 
      !p.questions?.regulation_category);
  }
  
  console.log(`Found ${filteredData.length} questions in box ${boxNumber}`);
  
  // Transform the joined questions
  return filteredData.map(item => ({
    ...item,
    questions: item.questions ? transformQuestion(item.questions) : null
  }));
}
