import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionCategory } from '@/types/questions'; // QuestionCategory might be less relevant here now
import { transformQuestion } from '../utils';

// Helper function to build the category filter string
function buildCategoryFilter(categoryIdentifiers: string | string[]): string {
  const identifiersArray = Array.isArray(categoryIdentifiers) ? categoryIdentifiers : [categoryIdentifiers];
  if (identifiersArray.length === 0) {
    return ""; 
  }

  const ids: string[] = [];
  const names: string[] = [];

  identifiersArray.forEach(idOrName => {
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(idOrName)) {
      ids.push(idOrName);
    } else {
      names.push(idOrName);
    }
  });

  const filterParts: string[] = [];
  if (ids.length > 0) {
    filterParts.push(`category_id.in.(${ids.map(id => `"${id}"`).join(',')})`);
  }
  if (names.length > 0) {
    filterParts.push(`category.in.(${names.map(name => `"${name}"`).join(',')})`);
  }
  
  return filterParts.join(',');
}

/**
 * Fetches user progress for questions that are due for review
 */
export async function fetchUserProgress(
  userId: string,
  categoryIdentifiers: string | string[], // New
  regulationCategory: string = "all"
) {
  const now = new Date().toISOString();
  let query = supabase
    .from('user_progress')
    .select('*, questions!inner(*)') // Use !inner to ensure questions exist and match the filter
    .eq('user_id', userId)
    .lte('next_review_at', now);

  const categoryFilterString = buildCategoryFilter(categoryIdentifiers);
  if (categoryFilterString) {
    // Apply category filter only if categoryIdentifiers are provided
    query = query.or(categoryFilterString, { referencedTable: 'questions' });
  } else {
    // If no categoryIdentifiers, we are fetching all due cards for the user
    // No specific category filter is applied here, but the join to questions table is still important
    // to ensure we only get progress for existing questions.
    console.log("fetchUserProgress: No category identifiers provided. Fetching all due cards for user.");
  }
  
  const { data: progressData, error: progressError } = await query;

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    throw new Error(`Error fetching progress data: ${progressError.message}`);
  }

  let filteredProgressData = progressData || [];
  if (regulationCategory !== "all") {
    filteredProgressData = filteredProgressData.filter(p =>
      p.questions?.regulation_category === regulationCategory ||
      p.questions?.regulation_category === "both" ||
      !p.questions?.regulation_category
    );
  }
  
  return filteredProgressData;
}

/**
 * Fetches new questions that the user hasn't seen yet
 */
export async function fetchNewQuestions(
  categoryIdentifiers: string | string[], // New
  regulationCategory: string = "all",
  questionIdsWithProgress: string[] = [],
  batchSize: number = 36
) {
  let newQuestionsQuery = supabase
    .from('questions')
    .select('*');

  const categoryFilterStringNewQ = buildCategoryFilter(categoryIdentifiers); // Renamed to avoid conflict in scope
  if (categoryFilterStringNewQ) {
    newQuestionsQuery = newQuestionsQuery.or(categoryFilterStringNewQ);
  } else {
    // If no categoryIdentifiers are provided (e.g. global review of due cards),
    // do not fetch any new questions. Focus is on reviewing what's due.
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
  
  return newQuestionsData || [];
}

/**
 * Fetches questions for practice mode
 */
export async function fetchPracticeQuestions(
  categoryIdentifiers: string | string[], // New
  regulationCategory: string = "all",
  batchSize: number = 36
) {
  let query = supabase
    .from('questions')
    .select('*');

  const categoryFilterString = buildCategoryFilter(categoryIdentifiers);
  if (categoryFilterString) {
    query = query.or(categoryFilterString);
  } else {
    console.warn("fetchPracticeQuestions: No valid category identifiers to filter by. Returning empty.");
    return []; // No categories, no practice questions
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

  return questions?.map(transformQuestion) || [];
}

/**
 * Fetches questions for a specific box number
 */
export async function fetchQuestionsByBox(
  userId: string,
  boxNumber: number,
  regulationCategory: string = "all"
) {
  console.log(`Fetching questions for user ${userId} in box ${boxNumber} with regulation ${regulationCategory}`);
  
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      questions!inner(*)
    `) // Ensure questions are joined for filtering
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
  
  return filteredData;
}
