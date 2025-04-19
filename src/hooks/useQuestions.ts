
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "@/api/questions";

export function useQuestions(category?: string, sub_category?: string) {
  return useQuery({
    queryKey: ['questions', category, sub_category],
    queryFn: () => fetchQuestions(category, sub_category)
  });
}
