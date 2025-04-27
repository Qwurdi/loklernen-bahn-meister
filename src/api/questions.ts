
import { supabase } from "@/integrations/supabase/client";
import type { CreateQuestionDTO, Question, QuestionCategory, Answer } from "@/types/questions";
import { Json } from "@/integrations/supabase/types";

// Helper function to convert database answers (Json) to Answer[]
export function transformAnswers(jsonAnswers: Json): Answer[] {
  if (Array.isArray(jsonAnswers)) {
    return jsonAnswers.map(answer => {
      // Safely check if answer is an object and access its properties
      if (typeof answer === 'object' && answer !== null) {
        return {
          text: 'text' in answer ? String(answer.text || '') : '',
          isCorrect: 'isCorrect' in answer ? Boolean(answer.isCorrect) : false
        };
      }
      // Return default values if the answer is not an object
      return { text: '', isCorrect: false };
    });
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

export async function fetchQuestions(category?: QuestionCategory, sub_category?: string, regulation_category?: string) {
  let query = supabase
    .from('questions')
    .select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (sub_category) {
    query = query.eq('sub_category', sub_category);
  }
  
  if (regulation_category && regulation_category !== "all") {
    // Include both "both" category and the specific one
    query = query.or(`regulation_category.eq.${regulation_category},regulation_category.eq.both,regulation_category.is.null`);
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
      created_by: question.created_by,
      regulation_category: question.regulation_category
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

// Predefined signal subcategories
export const signalSubCategories = [
  "Allgemeine Bestimmungen",
  "Hp-Signale",
  "Kombinationssignale (Ks)",
  "Lichthaupt- und Lichtvorsignale (Hl)",
  "Haupt- und Vorsignalverbindungen (Sv)",
  "Vr-Signale",
  "Zusatzsignale (Zs)",
  "Signale f��r Schiebelokomotiven und Sperrfahrten (Ts)",
  "Langsamfahrsignale (Lf)",
  "Schutzsignale (Sh)",
  "Signale für den Rangierdienst (Ra)",
  "Weichensignale (Wn)",
  "Signale für das Zugpersonal (Zp)",
  "Fahrleitungssignale (El)",
  "Signale an Zügen (Zg)",
  "Signale an einzelnen Fahrzeugen (Fz)",
  "Nebensignale (Ne)",
  "Signale für Bahnübergänge (Bü)",
  "Orientierungszeichen",
  "Signalkombinationen (Sk)"
] as const;

// Helper function to seed initial questions for each subcategory
export async function seedInitialQuestions(userId: string) {
  const sampleQuestions: CreateQuestionDTO[] = signalSubCategories.map((sub_category) => ({
    category: "Signale",
    sub_category,
    question_type: "open",
    difficulty: 1,
    text: `Was ist die Bedeutung des wichtigsten ${sub_category}?`,
    answers: [{ text: "Antwort wird noch hinzugefügt", isCorrect: true }],
    created_by: userId
  }));

  for (const question of sampleQuestions) {
    try {
      await createQuestion(question);
    } catch (error) {
      console.error(`Error seeding question for ${question.sub_category}:`, error);
    }
  }
}

export async function duplicateQuestion(originalQuestion: Question): Promise<Question> {
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
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
    regulation_category: originalQuestion.regulation_category
  };

  const supabaseAnswers: Json = duplicateData.answers.map(answer => ({
    text: answer.text,
    isCorrect: answer.isCorrect
  }));

  const { data, error } = await supabase
    .from('questions')
    .insert([{
      ...duplicateData,
      answers: supabaseAnswers,
    }])
    .select()
    .single();

  if (error) throw error;
  return transformQuestion(data);
}

// Add a function to filter questions by regulation category
export async function fetchRegulationCategoryQuestions(regulation_category: string) {
  return fetchQuestions(undefined, undefined, regulation_category);
}
