
import { supabase } from "@/integrations/supabase/client";
import type { CreateQuestionDTO, Question } from "@/types/questions";
import { prepareAnswerForStorage, prepareContentForStorage, transformQuestion } from "./transformers";
import { Json } from "@/integrations/supabase/types";

/**
 * Creates a new question
 */
export async function createQuestion(question: CreateQuestionDTO) {
  // Convert text content to proper format for storage
  const processedText = prepareContentForStorage(question.text);
  
  // Convert Answer[] to a JSON structure compatible with Supabase
  const supabaseAnswers = question.answers.map(prepareAnswerForStorage);

  // Process hint if it exists
  const processedHint = question.hint ? prepareContentForStorage(question.hint) : null;

  const { data, error } = await supabase
    .from('questions')
    .insert([{
      category: question.category,
      sub_category: question.sub_category,
      question_type: question.question_type,
      difficulty: question.difficulty,
      text: processedText,
      image_url: question.image_url,
      answers: supabaseAnswers,
      created_by: question.created_by,
      regulation_category: question.regulation_category,
      hint: processedHint
    }])
    .select()
    .single();
    
  if (error) throw error;
  return transformQuestion(data);
}

/**
 * Duplicates a question
 */
export async function duplicateQuestion(originalQuestion: Question): Promise<Question> {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    console.log("Duplicating question:", originalQuestion);
    
    // Create a duplicate of the question but with the current user as creator
    const duplicateData: CreateQuestionDTO = {
      category: originalQuestion.category,
      sub_category: originalQuestion.sub_category,
      question_type: originalQuestion.question_type,
      difficulty: originalQuestion.difficulty,
      text: originalQuestion.text,
      image_url: originalQuestion.image_url,
      answers: originalQuestion.answers,
      created_by: user.id, // Use current user's ID instead of original creator
      regulation_category: originalQuestion.regulation_category,
      hint: originalQuestion.hint // Retain the hint when duplicating
    };

    // Process text content for storage
    const processedText = prepareContentForStorage(duplicateData.text);
    
    // Convert answers to proper format
    const supabaseAnswers: Json = duplicateData.answers.map(prepareAnswerForStorage);

    // Process hint if it exists
    const processedHint = duplicateData.hint ? prepareContentForStorage(duplicateData.hint) : null;

    const { data, error } = await supabase
      .from('questions')
      .insert([{
        category: duplicateData.category,
        sub_category: duplicateData.sub_category,
        question_type: duplicateData.question_type,
        difficulty: duplicateData.difficulty,
        text: processedText,
        image_url: duplicateData.image_url,
        answers: supabaseAnswers,
        created_by: duplicateData.created_by,
        regulation_category: duplicateData.regulation_category,
        hint: processedHint
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error during duplication:", error);
      throw error;
    }
    
    console.log("Successfully duplicated question:", data);
    return transformQuestion(data);
  } catch (error) {
    console.error("Error in duplicateQuestion function:", error);
    throw error;
  }
}
