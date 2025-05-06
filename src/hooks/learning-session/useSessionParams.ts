
import { useSearchParams } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface SessionParams {
  categoryParam: QuestionCategory;
  subcategoryParam: string | null;
  regulationParam: string;
  boxParam?: number;
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

  // Create a more descriptive title based on parameters
  const getSessionTitle = () => {
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
    sessionTitle
  };
}
