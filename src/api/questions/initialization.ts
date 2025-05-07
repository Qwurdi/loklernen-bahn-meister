
import { supabase } from "@/integrations/supabase/client";
import type { CreateQuestionDTO } from "@/types/questions";
import { createQuestion } from "./mutations";

/**
 * Seeds initial questions into the database
 */
export async function seedInitialQuestions(userId: string) {
  // Import categories from the centralized categories API
  const { signalSubCategories } = await import('../categories/types');

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
