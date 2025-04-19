
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "@/api/questions";
import { QuestionCategory } from "@/types/questions";

export function useQuestions(category?: QuestionCategory, sub_category?: string) {
  return useQuery({
    queryKey: ['questions', category, sub_category],
    queryFn: () => fetchQuestions(category, sub_category)
  });
}
