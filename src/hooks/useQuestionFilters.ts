
import { useState, useMemo } from 'react';
import { Question, QuestionCategory, RegulationCategory } from '@/types/questions';

interface UseQuestionFiltersProps {
  questions: Question[] | undefined;
}

export function useQuestionFilters({ questions }: UseQuestionFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | QuestionCategory>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | null>(null);
  const [regulationFilter, setRegulationFilter] = useState<RegulationCategory | "all">("all");

  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    
    return questions.filter(question => {
      const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          question.sub_category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;
      const matchesSubCategory = !subCategoryFilter || question.sub_category === subCategoryFilter;
      
      // Handle regulation category filtering
      const matchesRegulation = regulationFilter === "all" || 
                              question.regulation_category === regulationFilter || 
                              question.regulation_category === "both" ||
                              question.regulation_category === undefined;  // For backward compatibility with older questions
      
      return matchesSearch && matchesCategory && matchesSubCategory && matchesRegulation;
    });
  }, [questions, searchQuery, categoryFilter, subCategoryFilter, regulationFilter]);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    regulationFilter,
    setRegulationFilter,
    filteredQuestions
  };
}
