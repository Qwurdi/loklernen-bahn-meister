
import { useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface SessionParams {
  categoryParam: QuestionCategory | null;  // Changed to allow null for due cards view
  subcategoryParam: string | null;
  regulationParam: string;
  boxParam?: number;
  sessionTitle: string;
  practiceMode: boolean;
  isDueCardsView: boolean; // Flag to identify due cards view
  parentCategoryParam: QuestionCategory | null; // New parameter to explicitly set parent category
}

export function useSessionParams(): SessionParams {
  const [searchParams] = useSearchParams();
  const { regulationPreference } = useUserPreferences();
  
  // Get category, subcategory, regulation preference and box number from URL parameters
  const categoryParamRaw = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;
  const boxParam = searchParams.get("box") ? parseInt(searchParams.get("box") || "0") : undefined;
  const practiceMode = searchParams.get("practice") === "true";
  const parentCategoryParamRaw = searchParams.get("parent_category");

  // Determine if we're in a due cards view (no specific category/subcategory)
  const isDueCardsView = !categoryParamRaw && !subcategoryParam;

  // Cast to QuestionCategory if provided, otherwise null
  const categoryParam = categoryParamRaw as QuestionCategory | null;
  const parentCategoryParam = (parentCategoryParamRaw === "Signale" || parentCategoryParamRaw === "Betriebsdienst") 
    ? parentCategoryParamRaw as QuestionCategory 
    : null;

  // Log params for debugging
  console.log("Session Params:", {
    category: categoryParam,
    subcategory: subcategoryParam,
    parentCategory: parentCategoryParam,
    regulation: regulationParam,
    box: boxParam,
    practice: practiceMode,
    isDueCardsView
  });

  // Helper function to strip regulation info from category title for display
  const stripRegulationInfo = (categoryName: string): string => {
    return categoryName.replace(/\s*\((?:DS|DV)\s+301\)$/i, "");
  };

  // Create a more descriptive title based on parameters
  const getSessionTitle = () => {
    let title = '';
    
    if (practiceMode) {
      title += 'Übungsmodus - ';
    }
    
    if (boxParam) {
      title += `Box ${boxParam} - `;
    } 
    
    if (subcategoryParam) {
      title += `${subcategoryParam}`;
    } else if (isDueCardsView) {
      title += 'Fällige Karten';
    } else if (categoryParam) {
      // Use category name for title display, but still keep any regulation info
      title += `${categoryParam}`;
    } else if (parentCategoryParam) {
      title += `${parentCategoryParam}`; 
    } else {
      title += 'Fällige Karten';
    }
    
    // Add regulation info if specific
    if (regulationParam !== "both") {
      title += ` (${regulationParam})`;
    }
    
    return title;
  };

  const sessionTitle = getSessionTitle();
  
  return {
    categoryParam,
    subcategoryParam,
    regulationParam,
    boxParam,
    sessionTitle,
    practiceMode,
    isDueCardsView,
    parentCategoryParam
  };
}
