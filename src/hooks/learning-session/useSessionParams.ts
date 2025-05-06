
import { useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useEffect } from "react";

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
  // Validate and default category to "Signale" if invalid
  const rawCategory = searchParams.get("category");
  const categoryParam = (rawCategory === "Signale" || rawCategory === "Betriebsdienst") 
    ? rawCategory as QuestionCategory 
    : "Signale";
    
  const subcategoryParam = searchParams.get("subcategory");
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;
  
  // Parse box parameter with safeguards
  const boxParamRaw = searchParams.get("box");
  const boxParam = boxParamRaw ? parseInt(boxParamRaw) : undefined;
  
  // Get selected categories from URL parameters (new)
  const selectedCategories = searchParams.getAll("categories");

  // Log parameters on mount for debugging
  useEffect(() => {
    console.log("Session parameters loaded:", {
      category: categoryParam,
      subcategory: subcategoryParam,
      regulation: regulationParam,
      box: boxParam,
      selectedCategories
    });
  }, [categoryParam, subcategoryParam, regulationParam, boxParam, selectedCategories]);

  // Create a more descriptive title based on parameters
  const getSessionTitle = () => {
    if (selectedCategories.length > 0) {
      return selectedCategories.length === 1 
        ? `${selectedCategories[0]} - Lernmodus` 
        : `${selectedCategories.length} Kategorien - Lernmodus`;
    }
    if (boxParam !== undefined) {
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
