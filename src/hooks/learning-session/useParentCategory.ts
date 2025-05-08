
import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { QuestionCategory } from "@/types/questions";

// Parent categories constants
const PARENT_CATEGORIES = ["Signale", "Betriebsdienst"];

export function useParentCategory(singleCategoryIdentifier?: string) {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [isParentCategory, setIsParentCategory] = useState(false);
  const [resolvedCategoryIdentifiers, setResolvedCategoryIdentifiers] = useState<string[]>([]);
  const [resolvedParentTitle, setResolvedParentTitle] = useState<string>("");

  useEffect(() => {
    if (categoriesLoading || !singleCategoryIdentifier) return;
    
    // Check if the singleCategoryIdentifier is a parent category
    if (PARENT_CATEGORIES.includes(singleCategoryIdentifier)) {
      console.log(`Detected parent category: ${singleCategoryIdentifier}`);
      setIsParentCategory(true);
      
      // Find all subcategories for this parent category
      const subcategories = categories
        .filter(cat => cat.parent_category === singleCategoryIdentifier)
        .map(cat => cat.name);
        
      if (subcategories.length > 0) {
        console.log(`Resolved ${subcategories.length} subcategories for ${singleCategoryIdentifier}`, subcategories);
        setResolvedCategoryIdentifiers(subcategories);
        setResolvedParentTitle(`${singleCategoryIdentifier} (alle Kategorien)`);
      } else {
        console.log(`No subcategories found for parent category: ${singleCategoryIdentifier}`);
      }
    } else {
      setIsParentCategory(false);
    }
  }, [singleCategoryIdentifier, categories, categoriesLoading]);

  return {
    isParentCategory,
    resolvedCategoryIdentifiers,
    resolvedParentTitle
  };
}
