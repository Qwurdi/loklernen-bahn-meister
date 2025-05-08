
import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionCategory } from '@/types/questions'; 
import { Flashcard } from '../types';
import { transformQuestionToFlashcard, transformQuestion } from '../utils';
import { getQuestionsByIds } from '@/api/questions';
import { buildCategoryFilter } from './helpers';

/**
 * Fetches specific cards by their IDs for spaced repetition
 */
export async function fetchSpecificCardsForSR(
  cardIds: number[],
  regulation?: string
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchSpecificCardsForSR', { cardIds, regulation });
  if (!cardIds || cardIds.length === 0) return [];
  
  const stringCardIds = cardIds.map(String);
  const questions = await getQuestionsByIds(stringCardIds, regulation);
  return questions.map(transformQuestionToFlashcard);
}

/**
 * Fetches due cards for spaced repetition across all categories
 */
export async function fetchDueCardsForSR(
  userId: string,
  regulation?: string,
  options: { batchSize?: number } = {}
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchDueCardsForSR', { userId, regulation, options });
  const batchSize = options.batchSize || 15;
  
  // Fetch user progress with due cards
  const now = new Date().toISOString();
  let query = supabase
    .from('user_progress')
    .select('*, questions!inner(*)')
    .eq('user_id', userId)
    .lte('next_review_at', now);

  if (regulation && regulation !== 'all') {
    // Include regulation filter
    query = query.or(
      `questions.regulation_category.eq.${regulation},questions.regulation_category.eq.both,questions.regulation_category.is.null`,
      { foreignTable: 'questions' }
    );
  }
  
  const { data: progressItems, error: progressError } = await query;
  
  if (progressError) {
    console.error("Error fetching due cards:", progressError);
    throw progressError;
  }
  
  // Transform to flashcards and limit by batch size
  let dueFlashcards = (progressItems || [])
    .filter(p => p.questions)
    .map(p => transformQuestionToFlashcard(transformQuestion(p.questions!)))
    .slice(0, batchSize);
  
  // If not enough due cards, fetch new questions
  if (dueFlashcards.length < batchSize && userId) {
    const neededNew = batchSize - dueFlashcards.length;
    
    // Get all question IDs that user has progress for (to exclude)
    const { data: allProgress } = await supabase
      .from('user_progress')
      .select('question_id')
      .eq('user_id', userId);
      
    const excludedIds = allProgress?.map(p => p.question_id) || [];
    
    // Fetch new questions from all categories
    let newQuestionsQuery = supabase
      .from('questions')
      .select('*')
      .limit(neededNew);
    
    if (regulation && regulation !== 'all') {
      newQuestionsQuery = newQuestionsQuery.or(
        `regulation_category.eq.${regulation},regulation_category.eq.both,regulation_category.is.null`
      );
    }
    
    if (excludedIds.length > 0) {
      newQuestionsQuery = newQuestionsQuery.not('id', 'in', `(${excludedIds.join(',')})`);
    }
    
    const { data: newQuestions, error: newError } = await newQuestionsQuery;
    
    if (newError) {
      console.error("Error fetching new questions:", newError);
    } else {
      const newFlashcards = (newQuestions || []).map(q => transformQuestionToFlashcard(transformQuestion(q)));
      dueFlashcards = [...dueFlashcards, ...newFlashcards];
    }
  }
  
  return dueFlashcards.slice(0, batchSize);
}

/**
 * Fetches cards for a specific category for spaced repetition
 */
export async function fetchCategoryCardsForSR(
  categoryIdentifier: string | string[],
  userId: string | undefined,
  regulation?: string,
  options: { batchSize?: number } = {}
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchCategoryCardsForSR', { categoryIdentifier, userId, regulation, options });
  const batchSize = options.batchSize || 15;
  
  if (!userId) {
    // Guest mode - just fetch practice questions
    return fetchPracticeQuestionsInternal(categoryIdentifier, regulation, batchSize);
  }
  
  // Logged-in user with specific category
  const now = new Date().toISOString();
  
  // 1. Fetch user progress for due cards in this category
  let progressQuery = supabase
    .from('user_progress')
    .select('*, questions!inner(*)')
    .eq('user_id', userId)
    .lte('next_review_at', now);
  
  // Apply category filter to the questions joined table
  const categoryFilterString = buildCategoryFilter(categoryIdentifier);
  if (categoryFilterString) {
    progressQuery = progressQuery.or(categoryFilterString, { referencedTable: 'questions' });
  }
  
  if (regulation && regulation !== 'all') {
    progressQuery = progressQuery.or(
      `questions.regulation_category.eq.${regulation},questions.regulation_category.eq.both,questions.regulation_category.is.null`, 
      { foreignTable: 'questions' }
    );
  }
  
  const { data: progressItems, error: progressError } = await progressQuery;
  
  if (progressError) {
    console.error("Error fetching category cards:", progressError);
    throw progressError;
  }
  
  // Get flashcards from progress items
  let categoryFlashcards = (progressItems || [])
    .map(p => transformQuestionToFlashcard(transformQuestion(p.questions!)))
    .slice(0, batchSize);
  
  // 2. If not enough due cards, fetch new questions in this category
  if (categoryFlashcards.length < batchSize) {
    const neededNew = batchSize - categoryFlashcards.length;
    
    // Get all question IDs user has seen in this category
    const { data: allProgress } = await supabase
      .from('user_progress')
      .select('question_id')
      .eq('user_id', userId);
      
    const excludedIds = allProgress?.map(p => p.question_id) || [];
    
    // Fetch new questions from this category
    const newQuestions = await fetchNewQuestionsInternal(
      categoryIdentifier,
      regulation,
      excludedIds,
      neededNew
    );
    
    categoryFlashcards = [...categoryFlashcards, ...newQuestions.map(q => transformQuestionToFlashcard(transformQuestion(q)))];
  }
  
  return categoryFlashcards.slice(0, batchSize);
}

/**
 * Fetches all cards for spaced repetition (behaves like fetchDueCardsForSR)
 */
export async function fetchAllCardsForSR(
  userId: string,
  regulation?: string,
  options: { batchSize?: number } = {}
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchAllCardsForSR', { userId, regulation, options });
  return fetchDueCardsForSR(userId, regulation, options);
}

// Internal helper function for fetching new questions
async function fetchNewQuestionsInternal(
  categoryIdentifiers: string | string[],
  regulation?: string,
  excludedQuestionIds: string[] = [],
  batchSize: number = 15
): Promise<any[]> {  // Using any[] as return type to avoid type issues
  let newQuestionsQuery = supabase
    .from('questions')
    .select('*');
  
  const categoryFilterString = buildCategoryFilter(categoryIdentifiers);
  if (categoryFilterString) {
    newQuestionsQuery = newQuestionsQuery.or(categoryFilterString);
  }
  
  if (regulation && regulation !== 'all') {
    newQuestionsQuery = newQuestionsQuery.or(
      `regulation_category.eq.${regulation},regulation_category.eq.both,regulation_category.is.null`
    );
  }
  
  if (excludedQuestionIds.length > 0) {
    newQuestionsQuery = newQuestionsQuery.not('id', 'in', `(${excludedQuestionIds.join(',')})`);
  }
  
  newQuestionsQuery = newQuestionsQuery.limit(batchSize);
  
  const { data, error } = await newQuestionsQuery;
  
  if (error) {
    console.error("Error fetching new questions:", error);
    throw error;
  }
  
  return data || [];
}

// Internal helper function for fetching practice questions
async function fetchPracticeQuestionsInternal(
  categoryIdentifiers: string | string[],
  regulation?: string,
  batchSize: number = 15
): Promise<Flashcard[]> {
  let query = supabase
    .from('questions')
    .select('*');
  
  const categoryFilterString = buildCategoryFilter(categoryIdentifiers);
  if (categoryFilterString) {
    query = query.or(categoryFilterString);
  } else {
    console.warn("fetchPracticeQuestionsInternal: No valid category identifiers to filter by. Returning empty.");
    return [];
  }
    
  if (regulation && regulation !== 'all') {
    query = query.or(`regulation_category.eq.${regulation},regulation_category.eq.both,regulation_category.is.null`);
  }
  
  query = query.limit(batchSize);
  
  const { data: questions, error } = await query;
  
  if (error) {
    console.error("Error fetching practice questions:", error);
    throw error;
  }
  
  return (questions || []).map(q => transformQuestionToFlashcard(transformQuestion(q)));
}
