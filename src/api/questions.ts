import { supabase } from "@/integrations/supabase/client";
import type { CreateQuestionDTO, Question, QuestionCategory, Answer } from "@/types/questions";
import { Json } from "@/integrations/supabase/types";
import { signalSubCategories, betriebsdienstSubCategories } from "@/api/categories/types";
import { isStructuredContent, plainTextToStructured, getTextValue, StructuredContent } from "@/types/rich-text";

// Helper function to convert database answers (Json) to Answer[]
export function transformAnswers(jsonAnswers: Json): Answer[] {
  if (Array.isArray(jsonAnswers)) {
    return jsonAnswers.map(answer => {
      // Safely check if answer is an object and access its properties
      if (typeof answer === 'object' && answer !== null) {
        const text = 'text' in answer ? answer.text : '';
        // Process text content
        let processedText: string | StructuredContent = '';
        
        // Handle JSON string that might be structured content
        if (typeof text === 'string' && text.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(text);
            if (isStructuredContent(parsed)) {
              processedText = parsed;
            } else {
              processedText = String(text);
            }
          } catch (e) {
            // Keep original text if parsing fails
            processedText = String(text);
          }
        } else if (typeof text === 'string') {
          processedText = text;
        } else {
          // Convert non-string values to string
          processedText = String(text);
        }
        
        return {
          text: processedText,
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
  // Check if text is in structured format
  const questionText = dbQuestion.text;
  let parsedText: string | StructuredContent = questionText;
  
  // Try to parse JSON text if it's a string that might be JSON
  if (typeof questionText === 'string' && questionText.trim().startsWith('{')) {
    try {
      const parsedJson = JSON.parse(questionText);
      if (isStructuredContent(parsedJson)) {
        parsedText = parsedJson;
      }
    } catch (e) {
      // If parsing fails, keep the original string
      console.log("Not valid JSON structured content:", e);
    }
  }
  
  return {
    ...dbQuestion,
    text: parsedText,
    answers: transformAnswers(dbQuestion.answers)
  };
}

// Helper function to prepare content for database storage
export function prepareContentForStorage(content: string | StructuredContent): string {
  if (typeof content === 'string') {
    return content;
  }
  
  // If it's already structured content, stringify it
  if (isStructuredContent(content)) {
    return JSON.stringify(content);
  }
  
  // If it's an object but not valid structured content, convert to plain text
  if (typeof content === 'object') {
    try {
      return JSON.stringify(content);
    } catch (e) {
      return String(content) || '';
    }
  }
  
  return String(content) || '';
}

// Helper function to prepare answer for database storage
export function prepareAnswerForStorage(answer: Answer): { text: string, isCorrect: boolean } {
  let processedText = typeof answer.text === 'string' 
    ? answer.text 
    : isStructuredContent(answer.text) 
      ? JSON.stringify(answer.text) 
      : String(answer.text || '');
      
  return {
    text: processedText,
    isCorrect: answer.isCorrect
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
  // Convert text content to proper format for storage
  const processedText = prepareContentForStorage(question.text);
  
  // Convert Answer[] to a JSON structure compatible with Supabase
  const supabaseAnswers = question.answers.map(prepareAnswerForStorage);

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
      hint: question.hint
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

export async function seedInitialQuestions(userId: string) {
  // Import categories from the centralized categories API
  const { signalSubCategories } = await import('./categories/types');

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
        hint: duplicateData.hint
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

// Add a function to filter questions by regulation category
export async function fetchRegulationCategoryQuestions(regulation_category: string) {
  return fetchQuestions(undefined, undefined, regulation_category);
}
