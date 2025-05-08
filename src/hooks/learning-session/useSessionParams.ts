
import { useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface SessionParams {
  categoryParam: QuestionCategory;
  subcategoryParam: string | null;
  regulationParam: string;
  boxParam?: number;
  sessionTitle: string;
  practiceMode: boolean; // Flag für Übungsmodus
}

export function useSessionParams(): SessionParams {
  const [searchParams] = useSearchParams();
  const { regulationPreference } = useUserPreferences();
  
  // Get category, subcategory, regulation preference and box number from URL parameters
  const categoryParam = searchParams.get("category") as QuestionCategory || "Signale";
  const subcategoryParam = searchParams.get("subcategory");
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;
  const boxParam = searchParams.get("box") ? parseInt(searchParams.get("box") || "0") : undefined;
  const practiceMode = searchParams.get("practice") === "true";

  // Log params for debugging
  console.log("Session Params:", {
    category: categoryParam,
    subcategory: subcategoryParam,
    regulation: regulationParam,
    box: boxParam,
    practice: practiceMode
  });

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
    practiceMode
  };
}
