
import React from "react";
import { RegulationFilterType } from "@/types/regulation";

interface CategoryCardCounts {
  total: number;
  byRegulation: Record<string, number>;
}

export const filterCategoriesByRegulation = (
  categories: string[],
  regulationFilter: RegulationFilterType,
  categoryCardCounts?: Record<string, CategoryCardCounts>
): string[] => {
  if (regulationFilter === "all") {
    return categories;
  }
  
  return categories.filter(subcategory => {
    const cardCounts = categoryCardCounts?.[subcategory];
    
    if (cardCounts) {
      // Include cards if they match the regulation OR have "Beide"/"both" regulation OR have no specific regulation set
      const hasCardsForRegulation = 
        (cardCounts.byRegulation[regulationFilter] > 0) || 
        (cardCounts.byRegulation["Beide"] > 0) || 
        (cardCounts.byRegulation["both"] > 0) ||
        (cardCounts.byRegulation["Allgemein"] > 0);
        
      return hasCardsForRegulation;
    }
    
    return true;
  });
};
