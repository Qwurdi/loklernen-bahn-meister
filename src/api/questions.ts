
import { supabase } from "@/integrations/supabase/client";
import type { CreateQuestionDTO, Question } from "@/types/questions";

export async function fetchQuestions(category?: string, sub_category?: string) {
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
  return data as Question[];
}

export async function createQuestion(question: CreateQuestionDTO) {
  const { data, error } = await supabase
    .from('questions')
    .insert([question])
    .select()
    .single();
    
  if (error) throw error;
  return data as Question;
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
