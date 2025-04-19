import { supabase } from "@/integrations/supabase/client";
import type { CreateQuestionDTO, Question, QuestionCategory, Answer } from "@/types/questions";
import { Json } from "@/integrations/supabase/types";

// Helper function to convert database answers (Json) to Answer[]
function transformAnswers(jsonAnswers: Json): Answer[] {
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

export async function createSampleQuestions(userId: string) {
  const sampleQuestions: CreateQuestionDTO[] = [
    {
      category: 'Signale',
      sub_category: 'Haupt- und Vorsignale',
      question_type: 'MC_single',
      difficulty: 2,
      text: 'Was bedeutet ein Hauptsignal mit grünem Licht?',
      answers: [
        { text: 'Fahrt ohne Einschränkungen möglich', isCorrect: true },
        { text: 'Langsamfahrt', isCorrect: false },
        { text: 'Halt', isCorrect: false }
      ]
    },
    {
      category: 'Signale',
      sub_category: 'Haupt- und Vorsignale',
      question_type: 'MC_single',
      difficulty: 3,
      text: 'Was zeigt ein Vorsignal mit gelber und grüner Lichtkombination an?',
      answers: [
        { text: 'Erwarte Signal "Fahrt"', isCorrect: true },
        { text: 'Sofortiger Halt', isCorrect: false },
        { text: 'Reduktion der Geschwindigkeit', isCorrect: false }
      ]
    },
    {
      category: 'Signale',
      sub_category: 'Haupt- und Vorsignale',
      question_type: 'MC_multi',
      difficulty: 4,
      text: 'Welche Aussagen über Hauptsignale sind korrekt?',
      answers: [
        { text: 'Hauptsignale regeln die Zugfahrt', isCorrect: true },
        { text: 'Hauptsignale geben Geschwindigkeitsbegrenzungen', isCorrect: true },
        { text: 'Hauptsignale sind nur dekorativ', isCorrect: false }
      ]
    },
    {
      category: 'Signale',
      sub_category: 'Haupt- und Vorsignale',
      question_type: 'open',
      difficulty: 5,
      text: 'Erklären Sie den Unterschied zwischen einem Hauptsignal und einem Vorsignal.',
      answers: [
        { text: 'Korrekte Erklärung über Funktion und Unterschied der Signale', isCorrect: true }
      ]
    }
  ];

  try {
    const results = await Promise.all(
      sampleQuestions.map(async (question) => {
        const { data, error } = await supabase
          .from('questions')
          .insert({
            ...question,
            created_by: userId,
            answers: JSON.stringify(question.answers)
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      })
    );

    return results;
  } catch (error) {
    console.error('Error creating sample questions:', error);
    throw error;
  }
}
