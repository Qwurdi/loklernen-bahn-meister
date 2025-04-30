
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "@/api/questions";
import { QuestionCategory } from "@/types/questions";

export function useQuestions(category?: QuestionCategory, sub_category?: string) {
  return useQuery({
    queryKey: ['questions', category, sub_category],
    queryFn: () => fetchQuestions(category, sub_category),
    // Add caching and retry configuration to improve performance
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Cache remains for 10 minutes
    retry: 2,                 // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}
