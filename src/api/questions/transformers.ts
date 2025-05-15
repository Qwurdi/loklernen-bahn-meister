import { Json } from "@/integrations/supabase/types";
import { Answer, Question } from "@/types/questions";
import { isStructuredContent, StructuredContent } from "@/types/rich-text";

/**
 * Helper function to convert database answers (Json) to Answer[]
 */
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

/**
 * Process a string that might contain structured content
 */
export function processStructuredContentString(text: string | null | undefined): string | StructuredContent {
  if (!text) return '';
  
  if (typeof text === 'string' && text.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      if (isStructuredContent(parsed)) {
        return parsed;
      }
    } catch (e) {
      // If parsing fails, return the original string
      console.log("Not valid JSON structured content:", e);
    }
  }
  return text;
}

/**
 * Helper function to transform database questions to application questions
 */
export function transformQuestion(dbQuestion: any): Question {
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
  
  // Process hint the same way as text
  let parsedHint: string | StructuredContent | null = dbQuestion.hint || null;
  if (typeof parsedHint === 'string' && parsedHint.trim().startsWith('{')) {
    try {
      const parsedJson = JSON.parse(parsedHint);
      if (isStructuredContent(parsedJson)) {
        parsedHint = parsedJson;
      }
    } catch (e) {
      // If parsing fails, keep the original string
      console.log("Not valid JSON hint content:", e);
    }
  }
  
  return {
    ...dbQuestion,
    text: parsedText,
    hint: parsedHint,
    answers: transformAnswers(dbQuestion.answers)
  };
}

/**
 * Helper function to prepare content for database storage
 */
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

/**
 * Helper function to prepare answer for database storage
 */
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
