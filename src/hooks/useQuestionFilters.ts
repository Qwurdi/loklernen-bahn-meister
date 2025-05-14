
import { useState, useMemo } from 'react';
import { Question, QuestionCategory, RegulationCategory } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import { getTextValue } from '@/types/rich-text';

interface UseQuestionFiltersProps {
  questions: Question[] | undefined;
  initialRegulationFilter?: RegulationFilterType;
  initialCategoryFilter?: "all" | QuestionCategory;
}

export function useQuestionFilters({ 
  questions, 
  initialRegulationFilter = "all",
  initialCategoryFilter = "all"
}: UseQuestionFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | QuestionCategory>(initialCategoryFilter);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | null>(null);
  const [regulationFilter, setRegulationFilter] = useState<RegulationFilterType>(initialRegulationFilter);

  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    
    return questions.filter(question => {
      const questionTextString = getTextValue(question.text).toLowerCase();
      const matchesSearch = questionTextString.includes(searchQuery.toLowerCase()) ||
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
