
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { RegulationFilterType } from "@/types/regulation";
import { determineMainCategory, mapUrlToSubcategory } from "@/utils/subcategory-utils";

export function useFlashcardSession() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subcategory: urlSubcategoryParam } = useParams<{ subcategory: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const { regulationPreference } = useUserPreferences();
  
  const regulationParam = searchParams.get("regelwerk") as RegulationFilterType || regulationPreference;

  // Get query parameters
  const categoryUrlQueryParam = searchParams.get('category');
  const parentCategoryParam = searchParams.get('parent_category');
  const categoriesUrlQueryParam = searchParams.getAll('categories');

  // Determine mainCategory and subCategory for fetching questions
  const mainCategoryForHook: QuestionCategory = determineMainCategory(
    urlSubcategoryParam,
    categoryUrlQueryParam,
    categoriesUrlQueryParam,
    parentCategoryParam
  );
  
  let subCategoryForHook: string | undefined = undefined;
  
  if (urlSubcategoryParam) {
    subCategoryForHook = mapUrlToSubcategory(urlSubcategoryParam);
  } else if (categoryUrlQueryParam) {
    const potentialSubCategory = mapUrlToSubcategory(categoryUrlQueryParam);
    if (potentialSubCategory && potentialSubCategory !== "Signale" && potentialSubCategory !== "Betriebsdienst") {
      subCategoryForHook = potentialSubCategory;
    }
  }

  console.log(`FlashcardPage: Detected main category: ${mainCategoryForHook}`);
  
  const isPracticeMode = !user;

  const {
    loading,
    dueQuestions: questions,
    submitAnswer
  } = useSpacedRepetition(
    mainCategoryForHook,
    subCategoryForHook,
    { 
      practiceMode: isPracticeMode,
      regulationCategory: regulationParam
    }
  );

  console.log(`FlashcardPage: Loading for mainCat: ${mainCategoryForHook}, subCat: ${subCategoryForHook}, practice: ${isPracticeMode}`);
  console.log("FlashcardPage: Loaded questions count:", questions?.length || 0);

  const { data: dueTodayStats } = useQuery({
    queryKey: ['dueTodayCount', user?.id, regulationParam],
    queryFn: async () => {
      if (!user) return { count: 0 };
      
      const { count, error } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString());
        
      if (error) throw error;
      
      return { count: count || 0 };
    },
    enabled: !!user
  });

  const remainingToday = (dueTodayStats?.count || 0);

  const handleAnswer = async (questionId: string, score: number) => {
    if (user) {
      await submitAnswer(questionId, score);
    }

    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);
  };

  const handleRegulationChange = (value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };

  return {
    loading,
    questions,
    user,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    remainingToday,
    subCategoryForHook,
    mainCategoryForHook,
    isPracticeMode,
    regulationParam,
    searchParams,
    handleAnswer,
    handleComplete,
    handleRegulationChange,
    navigate
  };
}
