import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionCategory, RegulationCategory } from '@/types/questions'; // Assuming QuestionCategory might be needed
import { UserProgress, Flashcard, SpacedRepetitionOptions } from './types';
import { transformQuestionToFlashcard } from './utils';
import { getQuestionsByIds as fetchQuestionsByIdsFromApi, transformQuestion } from '@/api/questions'; // Renamed to avoid conflict

const DEFAULT_BATCH_SIZE = 15;

// --------------------------------------------------------------------------------
// Low-Level Fetch and Update Functions (Interacting with Supabase)
// These are plausible implementations and might need adjustments to your DB schema.
// --------------------------------------------------------------------------------

export async function fetchUserProgress(
  userId: string,
  categoryIdentifiers: QuestionCategory[], // Geändert zu QuestionCategory[]
  regulation?: string
): Promise<(UserProgress & { questions: Question | null })[]> {
  console.log('SR_Service: fetchUserProgress', { userId, categoryIdentifiers, regulation });
  let query = supabase
    .from('user_progress')
    .select(`
      *,
      questions (*)
    `)
    .eq('user_id', userId)
    .order('next_review_at', { ascending: true });

  // TODO: Implement category and regulation filtering for user_progress if questions are joined
  // This is complex as filtering on joined table columns directly in select might not be straightforward
  // or might require a view/function in Supabase.
  // For now, fetches all progress and relies on post-filtering or that questions table has category info.
  // If categoryIdentifiers is provided and not empty, we might need to filter questions post-fetch
  // or adjust the query if the DB supports it well.

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
  
  // Transform joined questions
  return (data || []).map(progressItem => ({
    ...progressItem,
    questions: progressItem.questions ? transformQuestion(progressItem.questions) : null,
  }));
}

export async function fetchNewQuestions(
  categoryIdentifiers: QuestionCategory[], // Geändert zu QuestionCategory[]
  regulation?: string,
  excludedQuestionIds: string[] = [],
  limit: number = DEFAULT_BATCH_SIZE
): Promise<Question[]> {
  console.log('SR_Service: fetchNewQuestions', { categoryIdentifiers, regulation, excludedQuestionIds, limit });
  let query = supabase
    .from('questions')
    .select('*');

  if (categoryIdentifiers.length > 0) {
    // Assuming categoryIdentifiers can be names or IDs.
    // This might need adjustment if categories are stored differently (e.g., separate table, UUIDs)
    // For simplicity, let's assume 'category' column in 'questions' stores a name or an ID that matches.
    query = query.in('category', categoryIdentifiers); // categoryIdentifiers ist jetzt QuestionCategory[]
  }

  if (regulation && regulation !== 'all') {
    query = query.or(`regulation_category.eq.${regulation},regulation_category.eq.both,regulation_category.is.null`);
  }

  if (excludedQuestionIds.length > 0) {
    query = query.not('id', 'in', `(${excludedQuestionIds.join(',')})`);
  }

  query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching new questions:', error);
    throw error;
  }
  // answers-Feld nachladen/parsen, damit es immer Answer[] ist
  return (data || []).map(q => ({
    ...q,
    answers: typeof q.answers === 'string' ? JSON.parse(q.answers) : q.answers,
    regulation_category: (q.regulation_category === 'DS 301' || q.regulation_category === 'DV 301' || q.regulation_category === 'both')
      ? q.regulation_category as RegulationCategory
      : 'both', // Fallback für ungültige Werte
  }));
}

export async function fetchPracticeQuestions(
  categoryIdentifiers: QuestionCategory[], // Geändert zu QuestionCategory[]
  regulation?: string,
  limit: number = DEFAULT_BATCH_SIZE
): Promise<Question[]> {
  // For practice, we fetch questions similarly to new questions but without exclusion.
  // This could be more sophisticated, e.g., fetching most popular or specific practice sets.
  console.log('SR_Service: fetchPracticeQuestions', { categoryIdentifiers, regulation, limit });
  return fetchNewQuestions(categoryIdentifiers, regulation, [], limit);
}

export async function fetchQuestionsByBox(
  userId: string,
  boxNumber: number,
  regulation?: string
): Promise<(UserProgress & { questions: Question | null })[]> {
  console.log('SR_Service: fetchQuestionsByBox', { userId, boxNumber, regulation });
   let query = supabase
    .from('user_progress')
    .select(`
      *,
      questions (*)
    `)
    .eq('user_id', userId)
    .eq('box_number', boxNumber);

  // Add regulation filtering if applicable to questions within the box
  // Similar challenge as in fetchUserProgress for filtering on joined table.

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching questions by box:', error);
    throw error;
  }
  // Transform joined questions
  return (data || []).map(progressItem => ({
    ...progressItem,
    questions: progressItem.questions ? transformQuestion(progressItem.questions) : null,
  }));
}

export async function updateUserProgress(
  userId: string,
  questionId: string, // Assuming questionId is string from DB
  score: number, // Example: 1-5
  currentProgress?: UserProgress // Optional current progress to calculate next review
): Promise<UserProgress | null> {
  console.log('SR_Service: updateUserProgress', { userId, questionId, score });
  // This is a simplified SM-2 like algorithm placeholder
  // A more robust implementation would be needed for a real spaced repetition system.
  const now = new Date();
  let newIntervalDays = currentProgress?.interval_days || 0;
  let newEaseFactor = currentProgress?.ease_factor || 2.5;
  let newRepetitionCount = (currentProgress?.repetition_count || 0) + 1;
  let newBoxNumber = currentProgress?.box_number || 1;
  let newStreak = currentProgress?.streak || 0;

  if (score >= 3) { // Correct answer
    newStreak++;
    if (newRepetitionCount === 1) {
      newIntervalDays = 1;
      newBoxNumber = Math.min(5, newBoxNumber + 1); // Max box 5
    } else if (newRepetitionCount === 2) {
      newIntervalDays = 6;
      newBoxNumber = Math.min(5, newBoxNumber + 1);
    } else {
      newIntervalDays = Math.round(newIntervalDays * newEaseFactor);
      newBoxNumber = Math.min(5, newBoxNumber + 1);
    }
    newEaseFactor = newEaseFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;
  } else { // Incorrect answer
    newStreak = 0;
    newRepetitionCount = 0; // Reset repetition count
    newIntervalDays = 1;    // Reschedule for next day
    newBoxNumber = 1;       // Move back to box 1
  }

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(now.getDate() + newIntervalDays);

  const progressData = {
    user_id: userId,
    question_id: questionId,
    last_reviewed_at: now.toISOString(),
    next_review_at: nextReviewDate.toISOString(),
    ease_factor: newEaseFactor,
    interval_days: newIntervalDays,
    repetition_count: newRepetitionCount,
    box_number: newBoxNumber,
    streak: newStreak,
    last_score: score,
    // correct_count and incorrect_count would typically be updated based on score
    // This might require fetching current counts first or handling in DB trigger/function
  };

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(progressData, { onConflict: 'user_id, question_id' })
    .select()
    .single();

  if (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
  return data;
}

export async function updateUserStats(userId: string, score: number): Promise<void> {
  // This is a placeholder. Actual implementation depends on how stats are stored.
  // e.g., incrementing total reviews, correct/incorrect counts in a user_stats table.
  console.log('SR_Service: updateUserStats (placeholder)', { userId, score });
  // Example:
  // const { error } = await supabase.rpc('increment_user_review_stats', { user_id_param: userId, is_correct: score >=3 });
  // if (error) console.error('Error updating user stats:', error);
}


// --------------------------------------------------------------------------------
// High-Level Service Functions (Used by useSpacedRepetition hook)
// --------------------------------------------------------------------------------

export async function fetchSpecificCardsForSR(
  cardIds: number[],
  regulation?: string,
  // options?: SpacedRepetitionOptions // batchSize not typically used here
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchSpecificCardsForSR', { cardIds, regulation });
  if (!cardIds || cardIds.length === 0) return [];
  // The API function expects string IDs if your DB uses string IDs, adjust if Question.id is number
  const stringCardIds = cardIds.map(String);
  const questions = await fetchQuestionsByIdsFromApi(stringCardIds, regulation);
  return questions.map(transformQuestionToFlashcard);
}

export async function fetchDueCardsForSR(
  userId: string,
  regulation?: string,
  options: SpacedRepetitionOptions = {}
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchDueCardsForSR', { userId, regulation, options });
  const batchSize = options.batchSize || DEFAULT_BATCH_SIZE;
  
  // 1. Fetch user progress, ordered by next_review_at
  // We need questions associated with progress items to check their category/regulation if filtering is strict.
  const progressItems = await fetchUserProgress(userId, [], regulation); // Fetch all progress for now

  // Filter for due cards (next_review_at <= now)
  const now = new Date();
  const dueProgressItems = progressItems.filter(p => p.questions && new Date(p.next_review_at) <= now);

  let dueFlashcards = dueProgressItems
    .map(p => transformQuestionToFlashcard(p.questions!)) // We filtered for p.questions
    .slice(0, batchSize);

  // 2. If not enough due cards, fetch new questions
  if (dueFlashcards.length < batchSize) {
    const neededNew = batchSize - dueFlashcards.length;
    const excludedIds = progressItems.map(p => p.question_id); // Exclude all questions user has progress on
    
    // Fetch new questions from all categories if no specific category given to fetchUserProgress
    const newQuestions = await fetchNewQuestions([], regulation, excludedIds, neededNew);
    dueFlashcards = [...dueFlashcards, ...newQuestions.map(transformQuestionToFlashcard)];
  }
  
  return dueFlashcards.slice(0, batchSize);
}

export async function fetchCategoryCardsForSR(
  categoryIdentifier: QuestionCategory, // Geändert zu QuestionCategory
  userId: string | undefined, // Undefined for guest mode
  regulation?: string,
  options: SpacedRepetitionOptions = {}
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchCategoryCardsForSR', { categoryIdentifier, userId, regulation, options });
  const batchSize = options.batchSize || DEFAULT_BATCH_SIZE;

  if (!userId) { // Guest mode or practice mode without user context
    const practiceQuestions = await fetchPracticeQuestions([categoryIdentifier], regulation, batchSize);
    return practiceQuestions.map(transformQuestionToFlashcard);
  }

  // Logged-in user, specific category
  // 1. Fetch user progress for this category
  const progressItems = await fetchUserProgress(userId, [categoryIdentifier], regulation);
  
  // Filter for due cards in this category
  const now = new Date();
  const dueProgressItems = progressItems.filter(p => p.questions && new Date(p.next_review_at) <= now);

  let categoryFlashcards = dueProgressItems
    .map(p => transformQuestionToFlashcard(p.questions!))
    .slice(0, batchSize);

  // 2. If not enough, fetch new questions from this category
  if (categoryFlashcards.length < batchSize) {
    const neededNew = batchSize - categoryFlashcards.length;
    const excludedIds = progressItems.map(p => p.question_id);
    const newQuestions = await fetchNewQuestions([categoryIdentifier], regulation, excludedIds, neededNew); // Pass as array
    categoryFlashcards = [...categoryFlashcards, ...newQuestions.map(transformQuestionToFlashcard)];
  }

  return categoryFlashcards.slice(0, batchSize);
}

export async function fetchAllCardsForSR( // "All" might mean all "due" across all categories, or truly "all" cards user has ever seen.
  userId: string,                       // For this example, it mirrors fetchDueCardsForSR.
  regulation?: string,
  options: SpacedRepetitionOptions = {}
): Promise<Flashcard[]> {
  console.log('SR_Service: fetchAllCardsForSR (behaves like fetchDueCardsForSR)', { userId, regulation, options });
  return fetchDueCardsForSR(userId, regulation, options);
}

// Ensure all functions needed by useSpacedRepetition are exported.
// The hook also uses fetchQuestionsByBox, which is already defined above.
