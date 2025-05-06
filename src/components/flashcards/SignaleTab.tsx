
import React, { useEffect, useState } from "react";
import { fetchCategoriesByParent, signalSubCategories } from "@/api/categories";
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
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const dbCategories = await fetchCategoriesByParent('Signale');
        if (dbCategories && dbCategories.length > 0) {
          setCategories(dbCategories.map(cat => cat.name));
        } else {
          // Fallback to hardcoded categories if none found in DB
          setCategories([...signalSubCategories]);
        }
      } catch (error) {
        console.error("Error loading Signal categories:", error);
        // Fallback to hardcoded categories on error
        setCategories([...signalSubCategories]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);
  
  if (isLoading) {
    return <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
      ))}
    </div>;
  }
  
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
