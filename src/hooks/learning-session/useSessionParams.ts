
import { useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface SessionParams {
  categoryParam: QuestionCategory;
  subcategoryParam: string | null;
  regulationParam: string;
  boxParam?: number;
  selectedCategories: string[];
  sessionTitle: string;
}

export function useSessionParams(): SessionParams {
  const [searchParams] = useSearchParams();
  const { regulationPreference } = useUserPreferences();
  
  // Get category, subcategory, regulation preference and box number from URL parameters
  const categoryParam = searchParams.get("category") as QuestionCategory || "Signale";
  const subcategoryParam = searchParams.get("subcategory");
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;
  const boxParam = searchParams.get("box") ? parseInt(searchParams.get("box") || "0") : undefined;
  
  // Get selected categories from URL parameters (new)
  const selectedCategories = searchParams.getAll("categories");

  // Create a more descriptive title based on parameters
  const getSessionTitle = () => {
    if (selectedCategories.length > 0) {
      return selectedCategories.length === 1 
        ? `${selectedCategories[0]} - Lernmodus` 
        : `${selectedCategories.length} Kategorien - Lernmodus`;
    }
    if (boxParam) {
      return `Box ${boxParam} - Lernmodus`;
    } 
    if (subcategoryParam) {
      return `${subcategoryParam} - Lernmodus`;
    }
    return 'Fällige Karten - Lernmodus';
  };

  const sessionTitle = getSessionTitle();
  
  return {
    categoryParam,
    subcategoryParam,
    regulationParam,
    boxParam,
    selectedCategories,
    sessionTitle
  };
}
