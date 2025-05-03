
import React from "react";
import { signalSubCategories } from "@/api/questions";
import CategoryGrid from "./CategoryGrid";
import { RegulationFilterType } from "@/types/regulation";

interface SignaleTabProps {
  progressStats?: Record<string, any>;
  categoryCardCounts?: Record<string, any>;
  selectedCategories: string[];
  onSelectCategory: (subcategory: string) => void;
  isSelectable: boolean;
  regulationFilter: RegulationFilterType;
}

export default function SignaleTab({
  progressStats,
  categoryCardCounts,
  selectedCategories,
  onSelectCategory,
  isSelectable,
  regulationFilter
}: SignaleTabProps) {
  // Convert readonly array to regular string array to fix the type error
  const categories = [...signalSubCategories];
  
  return (
    <CategoryGrid
      categories={categories}
      progressStats={progressStats}
      categoryCardCounts={categoryCardCounts}
      selectedCategories={selectedCategories}
      onSelectCategory={onSelectCategory}
      isSelectable={isSelectable}
      regulationFilter={regulationFilter}
    />
  );
}
