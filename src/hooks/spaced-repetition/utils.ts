import { Question } from "@/types/questions";
import { transformQuestion as originalTransformQuestion } from "@/api/questions"; // Umbenannt, um Konflikt zu vermeiden
import { Flashcard } from "./types"; // Flashcard-Typ importieren

// Calculate the next review date based on the current date and interval
export function calculateNextReviewDate(date: Date, intervalDays: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
}

// Apply spacing factor to interval
export function applySpacingFactor(interval: number, factor: number = 2.5): number {
  return Math.round(interval * factor);
}

// Neue Transformationsfunktion: Question -> Flashcard
export function transformQuestionToFlashcard(question: Question): Flashcard {
  // id bleibt string, da Question.id ein string ist
  const flashcard: Flashcard = {
    id: question.id,
    category: question.category,
    sub_category: question.sub_category,
    question_type: question.question_type,
    difficulty: question.difficulty,
    text: question.text,
    image_url: question.image_url,
    answers: question.answers,
    created_by: question.created_by,
    revision: question.revision,
    created_at: question.created_at,
    updated_at: question.updated_at,
    regulation_category: question.regulation_category,
    hint: question.hint,
    // Beispiel für ein transformiertes Feld
    transformedContent: question.text,
  };
  return flashcard;
}

// Behalte die ursprüngliche transformQuestion-Funktion bei, falls sie noch anderweitig verwendet wird,
// oder benenne sie um, falls transformQuestionToFlashcard ihre Rolle vollständig übernimmt.
// Für dieses Beispiel exportieren wir beide, um Flexibilität zu gewährleisten.
export { originalTransformQuestion as transformQuestion };
