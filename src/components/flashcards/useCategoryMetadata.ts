import { useState, useEffect } from "react";
import { fetchCategoriesByParent } from "@/api/categories/index";

interface CategoryMetadata {
  isPro: boolean;
  isPlanned: boolean;
}

export const useCategoryMetadata = (categories: string[]): {
  categoryMetadata: Record<string, CategoryMetadata>;
  isLoading: boolean;
} => {
  const [categoryMetadata, setCategoryMetadata] = useState<Record<string, CategoryMetadata>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategoryMetadata = async () => {
      try {
        const parent = categories.some(cat => 
          ["Rangieren", "Züge fahren", "PZB & Sicherungsanlagen"].includes(cat)
        ) ? 'Betriebsdienst' : 'Signale';
        
        const dbCategories = await fetchCategoriesByParent(parent);
        
        // Create a map of category name to metadata (isPro and isPlanned status)
        const metadataMap = dbCategories.reduce((map: Record<string, CategoryMetadata>, cat) => {
          map[cat.name] = { 
            isPro: !!cat.isPro,
            isPlanned: !!cat.isPlanned
          };
          return map;
        }, {});
        
        setCategoryMetadata(metadataMap);
      } catch (error) {
        console.error("Error fetching category metadata:", error);
        // Fallback for Betriebsdienst categories that are typically Pro
        if (categories.some(cat => ["Rangieren", "Züge fahren"].includes(cat))) {
          const DEFAULT_PRO_CATEGORIES = [
            "Rangieren", 
            "Züge fahren", 
            "PZB & Sicherungsanlagen", 
            "Kommunikation", 
            "Besonderheiten", 
            "Unregelmäßigkeiten"
          ];
          
          const fallbackMap = categories.reduce((map: Record<string, CategoryMetadata>, cat) => {
            map[cat] = { 
              isPro: DEFAULT_PRO_CATEGORIES.includes(cat),
              isPlanned: false // Default to false for isPlanned in fallback
            };
            return map;
          }, {});
          
          setCategoryMetadata(fallbackMap);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryMetadata();
  }, [categories]);

  return { categoryMetadata, isLoading };
};
