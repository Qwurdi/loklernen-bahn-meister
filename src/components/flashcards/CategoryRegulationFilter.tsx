import React from "react";
import { RegulationFilterType } from "@/types/regulation";
import { Category } from "@/api/categories/types"; // Added

interface CategoryCardCounts {
  total: number;
  byRegulation: Record<string, number>;
}

export const filterCategoriesByRegulation = (
  categories: Category[], // Changed from string[] to Category[]
  regulationFilter: RegulationFilterType,
  categoryCardCounts?: Record<string, CategoryCardCounts> // Key is category.name
): Category[] => { // Return type changed to Category[]
  if (regulationFilter === "all") {
    return categories;
  }
  
  return categories.filter(category => { // Iterate over Category objects
    const cardCounts = categoryCardCounts?.[category.name]; // Access by category.name
    
    if (cardCounts) {
      const hasCardsForRegulation = 
        (cardCounts.byRegulation[regulationFilter] > 0) || 
        (cardCounts.byRegulation["Beide"] > 0) || 
        (cardCounts.byRegulation["both"] > 0) ||
        (cardCounts.byRegulation["Allgemein"] > 0);
        
      return hasCardsForRegulation;
    }
    // If no card counts for this category, include it by default, 
    // or decide if it should be excluded if counts are essential.
    // For now, keeping the original behavior of including it.
    return true;
  });
};
