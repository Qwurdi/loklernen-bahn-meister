
import { supabase } from "@/integrations/supabase/client";
import type { CreateQuestionDTO, Question, QuestionCategory, Answer } from "@/types/questions";
import { Json } from "@/integrations/supabase/types";

// Helper function to convert database answers (Json) to Answer[]
function transformAnswers(jsonAnswers: Json): Answer[] {
  if (Array.isArray(jsonAnswers)) {
    return jsonAnswers.map(answer => ({
      text: typeof answer === 'object' && answer !== null ? String(answer.text || '') : '',
      isCorrect: typeof answer === 'object' && answer !== null ? Boolean(answer.isCorrect) : false
    }));
  }
  return [];
}

// Helper function to transform database questions to application questions
function transformQuestion(dbQuestion: any): Question {
  return {
    ...dbQuestion,
    answers: transformAnswers(dbQuestion.answers)
  };
}

export async function fetchQuestions(category?: QuestionCategory, sub_category?: string) {
  let query = supabase
    .from('questions')
    .select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (sub_category) {
    query = query.eq('sub_category', sub_category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  // Transform the data to match our application types
  return (data || []).map(transformQuestion);
}

export async function createQuestion(question: CreateQuestionDTO) {
  // Convert Answer[] to a JSON structure compatible with Supabase
  const supabaseAnswers: Json = question.answers.map(answer => ({
    text: answer.text,
    isCorrect: answer.isCorrect
  }));

  const { data, error } = await supabase
    .from('questions')
    .insert([{
      category: question.category,
      sub_category: question.sub_category,
      question_type: question.question_type,
      difficulty: question.difficulty,
      text: question.text,
      image_url: question.image_url,
      answers: supabaseAnswers,
      created_by: question.created_by
    }])
    .select()
    .single();
    
  if (error) throw error;
  return transformQuestion(data);
}

export async function uploadQuestionImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random()}.${fileExt}`;
  
  const { error } = await supabase
    .storage
    .from('question-images')
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data } = supabase
    .storage
    .from('question-images')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
}
