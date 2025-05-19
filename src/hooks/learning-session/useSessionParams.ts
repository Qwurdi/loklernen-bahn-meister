
import { useParams, useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { RegulationFilterType } from "@/types/regulation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { determineMainCategory, mapUrlToSubcategory } from "@/utils/subcategory-utils";

/**
 * Hook to manage and provide all session parameters for flashcard and learning sessions
 */
export function useSessionParams() {
  const { subcategory: urlSubcategoryParam } = useParams<{ subcategory: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { regulationPreference } = useUserPreferences();
  
  // Get query parameters
  const categoryParam = searchParams.get('category');
  const parentCategoryParam = searchParams.get('parent_category');
  const categoriesUrlQueryParam = searchParams.getAll('categories');
  const regulationParam = searchParams.get("regelwerk") as RegulationFilterType || regulationPreference;
  const boxParam = searchParams.get("box");
  
  // Determine mainCategory and subCategory for fetching questions
  const mainCategoryForHook: QuestionCategory = determineMainCategory(
    urlSubcategoryParam,
    categoryParam,
    categoriesUrlQueryParam,
    parentCategoryParam
  );
  
  let subCategoryParam: string | undefined = undefined;
  
  if (urlSubcategoryParam) {
    subCategoryParam = mapUrlToSubcategory(urlSubcategoryParam);
  } else if (categoryParam) {
    const potentialSubCategory = mapUrlToSubcategory(categoryParam);
    if (potentialSubCategory && potentialSubCategory !== "Signale" && potentialSubCategory !== "Betriebsdienst") {
      subCategoryParam = potentialSubCategory;
    }
  }

  // Determine if we're in a due cards view
  const isDueCardsView = searchParams.has("due") || searchParams.get("view") === "due";

  // Generate a session title based on parameters
  const sessionTitle = subCategoryParam || mainCategoryForHook || "Lernkarten";

  const setRegulationFilter = (value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };

  return {
    // URL and search parameters
    urlSubcategoryParam,
    categoryParam,
    parentCategoryParam,
    categoriesUrlQueryParam,
    regulationParam,
    boxParam,
    searchParams,
    setSearchParams,
    
    // Derived parameters
    mainCategoryForHook,
    subCategoryParam,
    isDueCardsView,
    sessionTitle,
    
    // Actions
    setRegulationFilter
  };
}

// Legacy exports for backward compatibility
export const useFlashcardSessionParams = useSessionParams;
