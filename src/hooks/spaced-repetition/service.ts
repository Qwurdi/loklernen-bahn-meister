
import { supabase } from '@/integrations/supabase/client';
import { UserProgress } from './types';
import { transformQuestion } from './utils';
import { Question, QuestionCategory } from '@/types/questions';

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

export async function updateUserProgress(
  userId: string, 
  questionId: string, 
  score: number, 
  currentProgress?: UserProgress
) {
  const { interval_days, ease_factor, next_review_at } = calculateNextReview(score, currentProgress);
  console.log(`Submitting answer for question ${questionId} with score ${score}, next review in ${interval_days} days`);

  if (currentProgress) {
    // Update existing progress
    const { error } = await supabase
      .from('user_progress')
      .update({
        last_reviewed_at: new Date().toISOString(),
        next_review_at,
        ease_factor,
        interval_days,
        repetition_count: (currentProgress.repetition_count || 0) + 1,
        correct_count: score >= 4 ? (currentProgress.correct_count || 0) + 1 : currentProgress.correct_count,
        incorrect_count: score < 4 ? (currentProgress.incorrect_count || 0) + 1 : currentProgress.incorrect_count,
        last_score: score
      })
      .eq('id', currentProgress.id);

    if (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  } else {
    // Create new progress entry
    const { error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        question_id: questionId,
        last_reviewed_at: new Date().toISOString(),
        next_review_at,
        ease_factor,
        interval_days,
        repetition_count: 1,
        correct_count: score >= 4 ? 1 : 0,
        incorrect_count: score < 4 ? 1 : 0,
        last_score: score
      });

    if (error) {
      console.error("Error creating progress:", error);
      throw error;
    }
  }

  return { userId, questionId, score };
}

export async function updateUserStats(userId: string, score: number) {
  // Update user stats - first check if user has stats
  const { data: existingStats, error: statsCheckError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (statsCheckError && statsCheckError.code !== 'PGRST116') {
    console.error("Error checking user stats:", statsCheckError);
    throw statsCheckError;
  }
  
  // Calculate XP to add (10 points per score level)
  const xpToAdd = score * 10;
  
  if (existingStats) {
    // Update existing stats
    const { error: statsUpdateError } = await supabase.from('user_stats').update({
      last_activity_date: new Date().toISOString(),
      xp: existingStats.xp + xpToAdd,
      total_correct: existingStats.total_correct + (score >= 4 ? 1 : 0),
      total_incorrect: existingStats.total_incorrect + (score < 4 ? 1 : 0)
    }).eq('user_id', userId);

    if (statsUpdateError) {
      console.error("Error updating stats:", statsUpdateError);
      throw statsUpdateError;
    }
  } else {
    // Create new stats record
    const { error: statsInsertError } = await supabase.from('user_stats').insert({
      user_id: userId,
      last_activity_date: new Date().toISOString(),
      xp: xpToAdd,
      total_correct: score >= 4 ? 1 : 0,
      total_incorrect: score < 4 ? 1 : 0
    });

    if (statsInsertError) {
      console.error("Error creating stats:", statsInsertError);
      throw statsInsertError;
    }
  }
}
