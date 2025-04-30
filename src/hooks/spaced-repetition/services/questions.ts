
import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionCategory } from '@/types/questions';
import { transformQuestion } from '../utils';

/**
 * Fetches user progress for questions that are due for review
 */
export async function fetchUserProgress(
  userId: string,
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all"
) {
  console.log("Loading due questions for user", userId, "with regulation", regulationCategory);
  
  // First get progress data for questions that are due
  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select('*, questions(*)')
    .eq('user_id', userId)
    .lte('next_review_at', new Date().toISOString());

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    throw new Error(`Error fetching progress data: ${progressError.message}`);
  }

  // Filter the progress data by category and subcategory
  let filteredProgressData = progressData || [];
  console.log("Got progress data:", filteredProgressData.length, "items");
  
  // Filter by category
  filteredProgressData = filteredProgressData.filter(p => 
    p.questions?.category === category);
  
  // Filter by subcategory if specified
  if (subcategory) {
    filteredProgressData = filteredProgressData.filter(p => 
      p.questions?.sub_category === subcategory);
  }
  
  // Apply regulation filter if not "all"
  if (regulationCategory !== "all") {
    filteredProgressData = filteredProgressData.filter(p => 
      p.questions?.regulation_category === regulationCategory || 
      p.questions?.regulation_category === "both" || 
      !p.questions?.regulation_category);
  }
  
  console.log("Filtered progress data:", filteredProgressData.length, "items");

  return filteredProgressData;
}

/**
 * Fetches new questions that the user hasn't seen yet
 */
export async function fetchNewQuestions(
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  questionIdsWithProgress: string[] = [],
  batchSize: number = 50
) {
  // Build the query for new questions
  let newQuestionsQuery = supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .limit(batchSize);
    
  if (subcategory) {
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

/**
 * Fetches questions for practice mode
 */
export async function fetchPracticeQuestions(
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 50
) {
  let query = supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .limit(batchSize);
    
  if (subcategory) {
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
