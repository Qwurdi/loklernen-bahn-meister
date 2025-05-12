
import { useParams, useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { RegulationFilterType } from "@/types/regulation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { determineMainCategory, mapUrlToSubcategory } from "@/utils/subcategory-utils";

export function useFlashcardSessionParams() {
  const { subcategory: urlSubcategoryParam } = useParams<{ subcategory: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { regulationPreference } = useUserPreferences();
  
  // Get query parameters
  const categoryUrlQueryParam = searchParams.get('category');
  const parentCategoryParam = searchParams.get('parent_category');
  const categoriesUrlQueryParam = searchParams.getAll('categories');
  const regulationParam = searchParams.get("regelwerk") as RegulationFilterType || regulationPreference;
  
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

  const setRegulationFilter = (value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };

  return {
    urlSubcategoryParam,
    categoryUrlQueryParam,
    parentCategoryParam,
    categoriesUrlQueryParam,
    regulationParam,
    searchParams,
    setSearchParams,
    mainCategoryForHook,
    subCategoryForHook,
    setRegulationFilter
  };
}
