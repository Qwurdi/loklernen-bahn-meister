
import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionCategory } from '@/types/questions';
import { transformQuestion } from '../utils';

/**
 * Fetches user progress for questions that are due for review
 */
export async function fetchUserProgress(
  userId: string,
  category?: QuestionCategory | null,
  subcategory?: string,
  regulationCategory: string = "all",
  includeAllSubcategories: boolean = false
) {
  console.log("Loading due questions for user", userId, "with regulation", regulationCategory, "and subcategory", subcategory || "all");
  console.log("Include all subcategories:", includeAllSubcategories);
  
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
  
  // Filter by category if specified and not loading all subcategories
  if (category && !includeAllSubcategories) {
    filteredProgressData = filteredProgressData.filter(p => 
      p.questions?.category === category);
  } else if (category && includeAllSubcategories) {
    // For parent categories, include all questions where parent_category matches
    console.log(`Loading all subcategories for parent category: ${category}`);
    
    // Need to match on parent_category (which would be "Signale" or "Betriebsdienst")
    // For database structure where we don't have parent_category column in questions table,
    // we can just use the category field directly
    filteredProgressData = filteredProgressData.filter(p => 
      p.questions?.category === category);
  }
  
  // Filter by subcategory if specified
  if (subcategory) {
    filteredProgressData = filteredProgressData.filter(p => 
      p.questions?.sub_category === subcategory);
  }
  
  // Apply regulation filter if not "all"
  if (regulationCategory !== "all") {
    filteredProgressData = filteredProgressData.filter(p => 
      // Include if the regulation matches OR is "both" OR is not specified
      p.questions?.regulation_category === regulationCategory || 
      p.questions?.regulation_category === "both" || 
      !p.questions?.regulation_category);
  }
  
  // Remove duplicate entries - keep only the most recent entry for each question
  const questionIdsMap = new Map();
  filteredProgressData.forEach(item => {
    const existingItem = questionIdsMap.get(item.question_id);
    if (!existingItem || new Date(item.updated_at) > new Date(existingItem.updated_at)) {
      questionIdsMap.set(item.question_id, item);
    }
  });
  
  filteredProgressData = Array.from(questionIdsMap.values());
  
  console.log("Filtered progress data (after deduplication):", filteredProgressData.length, "items");

  return filteredProgressData;
}

/**
 * Fetches new questions that the user hasn't seen yet
 */
export async function fetchNewQuestions(
  category?: QuestionCategory | null,
  subcategory?: string,
  regulationCategory: string = "all",
  questionIdsWithProgress: string[] = [],
  batchSize: number = 36,
  includeAllSubcategories: boolean = false
) {
  console.log("Fetching new questions for category:", category, "subcategory:", subcategory, "regulation:", regulationCategory);
  console.log("Include all subcategories:", includeAllSubcategories);
  
  // Build the query for new questions
  let newQuestionsQuery = supabase.from('questions').select('*');
    
  // Filter by category if specified and not loading all subcategories
  if (category && !includeAllSubcategories) {
    newQuestionsQuery = newQuestionsQuery.eq('category', category);
  } else if (category && includeAllSubcategories) {
    // For parent categories, include all questions where category matches
    // This assumes we have direct parent categories in the database
    // If we had a parent_category field, we would filter on that instead
    newQuestionsQuery = newQuestionsQuery.eq('category', category);
  }
    
  // Filter by subcategory if specified
  if (subcategory) {
    newQuestionsQuery = newQuestionsQuery.eq('sub_category', subcategory);
  }
  
  // Apply regulation filter if not "all"
  if (regulationCategory !== "all") {
    newQuestionsQuery = newQuestionsQuery.or(
      `regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`
    );
  }

  // Add limit and order
  newQuestionsQuery = newQuestionsQuery.limit(batchSize);

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
  category?: QuestionCategory | null,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 36,
  includeAllSubcategories: boolean = false
) {
  console.log("Practice mode: Fetching questions for category:", category, "subcategory:", subcategory, "regulation:", regulationCategory);
  console.log("Include all subcategories:", includeAllSubcategories);
  
  let query = supabase.from('questions').select('*');
    
  // Filter by category if specified and not loading all subcategories  
  if (category && !includeAllSubcategories) {
    query = query.eq('category', category);
  } else if (category && includeAllSubcategories) {
    // For parent categories like "Signale" or "Betriebsdienst",
    // we would ideally filter on parent_category field
    // Without that field, we're using category directly
    query = query.eq('category', category);
  }
    
  // Filter by subcategory if specified
  if (subcategory) {
    query = query.eq('sub_category', subcategory);
  }
  
  // Apply regulation filter if specified and not "all"
  if (regulationCategory !== "all") {
    query = query.or(`regulation_category.eq.${regulationCategory},regulation_category.eq.both,regulation_category.is.null`);
  }

  // Add limit
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
  regulationCategory: string = "all",
  includeAllSubcategories: boolean = false
) {
  console.log(`Fetching questions for user ${userId} in box ${boxNumber} with regulation ${regulationCategory}`);
  console.log("Include all subcategories:", includeAllSubcategories);
  
  // Use the newly created stored procedure to get latest progress entries per question
  const { data, error } = await supabase
    .rpc('get_latest_progress_by_box', { 
      p_user_id: userId, 
      p_box_number: boxNumber 
    });
    
  if (error) {
    console.error("Error fetching questions by box:", error);
    throw error;
  }
  
  // Filter by regulation if needed
  let filteredData = data || [];
  
  if (regulationCategory !== "all" && Array.isArray(filteredData)) {
    filteredData = filteredData.filter(p => 
      p.questions?.regulation_category === regulationCategory || 
      p.questions?.regulation_category === "both" || 
      !p.questions?.regulation_category);
  }
  
  console.log(`Found ${filteredData.length} questions in box ${boxNumber} (after deduplication)`);
  
  return filteredData;
}
