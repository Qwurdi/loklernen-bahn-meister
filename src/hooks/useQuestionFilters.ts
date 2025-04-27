
import { useState, useMemo } from 'react';
import { Question, QuestionCategory } from '@/types/questions';

interface UseQuestionFiltersProps {
  questions: Question[] | undefined;
}

export function useQuestionFilters({ questions }: UseQuestionFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | QuestionCategory>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    
    return questions.filter(question => {
      const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          question.sub_category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;
      const matchesSubCategory = !subCategoryFilter || question.sub_category === subCategoryFilter;
      
      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [questions, searchQuery, categoryFilter, subCategoryFilter]);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    filteredQuestions
  };
}
