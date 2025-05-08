import { useSearchParams } from "react-router-dom";
// import { QuestionCategory } from "@/types/questions"; // Replaced with string
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface SessionParams {
  singleCategoryIdentifier?: string; // For a single category (ID or name)
  multipleCategoryIdentifiers?: string[]; // For multiple categories (names or IDs)
  // subcategoryParam: string | null; // This might become less relevant if using full category IDs/names
  regulationParam: string;
  boxParam?: number;
  sessionTitle: string;
  practiceMode: boolean;
}

export function useSessionParams(): SessionParams {
  const [searchParams] = useSearchParams();
  const { regulationPreference } = useUserPreferences();
  
  const singleCategory = searchParams.get("category");
  const multipleCategoriesRaw = searchParams.get("categories"); // Assuming it's a single param with comma-separated values
  // Or, if you expect multiple 'categories' params: const multipleCategoriesRawArray = searchParams.getAll("categories");

  let singleCategoryIdentifier: string | undefined = undefined;
  let multipleCategoryIdentifiers: string[] | undefined = undefined;

  if (multipleCategoriesRaw) {
    multipleCategoryIdentifiers = multipleCategoriesRaw.split(',').map(name => name.trim()).filter(name => name.length > 0);
  } else if (singleCategory) {
    singleCategoryIdentifier = singleCategory;
  }

  // const subcategoryParam = searchParams.get("subcategory"); // Keep if still needed, or derive from full category name
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;
  const boxParam = searchParams.get("box") ? parseInt(searchParams.get("box") || "0") : undefined;
  const practiceMode = searchParams.get("practice") === "true";

  console.log("Session Params:", {
    singleCategory: singleCategoryIdentifier,
    multipleCategories: multipleCategoryIdentifiers,
    regulation: regulationParam,
    box: boxParam,
    practice: practiceMode
  });

  const getSessionTitle = () => {
    let title = '';
    if (practiceMode) title += 'Übungsmodus - ';
    if (boxParam) title += `Box ${boxParam} - `;

    if (multipleCategoryIdentifiers && multipleCategoryIdentifiers.length > 0) {
      if (multipleCategoryIdentifiers.length === 1) {
        title += multipleCategoryIdentifiers[0];
      } else {
        title += `Auswahl (${multipleCategoryIdentifiers.length} Kategorien)`;
      }
    } else if (singleCategoryIdentifier) {
      // If it's an ID, we might not have the name here yet. 
      // The LearningSessionPage will resolve the name via useCategories.
      // For now, we can use the ID or a generic placeholder.
      title += singleCategoryIdentifier; // Or a placeholder like "Ausgewählte Kategorie"
    } else {
      title += 'Fällige Karten'; // Default if no category specified (e.g. global due cards)
    }
    
    if (regulationParam !== "both" && regulationParam !== "all") { // Adjusted condition
      title += ` (${regulationParam.toUpperCase()})`;
    }
    return title;
  };

  const sessionTitle = getSessionTitle();
  
  return {
    singleCategoryIdentifier,
    multipleCategoryIdentifiers,
    // subcategoryParam, // Include if still used
    regulationParam,
    boxParam,
    sessionTitle,
    practiceMode
  };
}
