import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionParams } from "@/hooks/learning-session/useSessionParams";
import { useCategoryValidation } from "@/hooks/learning-session/useCategoryValidation";

export function useSessionData() {
  const { user } = useAuth();
  
  // Get session parameters from URL
  const {
    categoryParam,
    subCategoryParam,
    regulationParam,
    boxParam,
    sessionTitle,
    isDueCardsView
  } = useSessionParams();

  console.log("Learning session parameters:", {
    category: categoryParam,
    subcategory: subCategoryParam,
    regulation: regulationParam,
    box: boxParam,
    isDueCardsView
  });

  // Load categories data
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Validate category and handle authentication requirements
  const {
    categoryRequiresAuth,
    categoryFound,
    isParentCategory,
    stripRegulationInfo,
    getCategoryForSpacedRepetition
  } = useCategoryValidation(categories, categoriesLoading, categoryParam, isDueCardsView);

  // Pass both category, subcategory and regulation preference to the hook
  // Use optimized batch size of 15 cards per session
  const {
    loading: questionsLoading,
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount
  } = useSpacedRepetition(
    getCategoryForSpacedRepetition(),
    subCategoryParam,
    {
      practiceMode: false,
      regulationCategory: regulationParam,
      boxNumber: boxParam ? parseInt(boxParam, 10) : undefined, // Parse box number from string to number
      batchSize: 15,
      includeAllSubcategories: isParentCategory
    }
  );

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0);

  return {
    user,
    categoryParam,
    subCategoryParam,
    regulationParam,
    boxParam,
    sessionTitle,
    isDueCardsView,
    categories,
    categoriesLoading,
    categoryRequiresAuth,
    categoryFound,
    isParentCategory,
    stripRegulationInfo,
    questionsLoading,
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount
  };
}
