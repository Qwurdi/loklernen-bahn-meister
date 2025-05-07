import React, { useEffect, useState } from "react";
import { RegulationFilterType } from "@/types/regulation";
import { fetchCategoriesByParent } from "@/api/categories/index";
import CategoryGrid from "@/components/flashcards/CategoryGrid";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface BetriebsdienstTabProps {
  progressStats?: Record<string, any>;
  categoryCardCounts?: Record<string, any>;
  selectedCategories: string[];
  onSelectCategory: (subcategory: string) => void;
  isSelectable: boolean;
  regulationFilter: RegulationFilterType;
  user: any;
}

export default function BetriebsdienstTab({
  progressStats,
  categoryCardCounts,
  selectedCategories,
  onSelectCategory,
  isSelectable,
  regulationFilter,
  user
}: BetriebsdienstTabProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const dbCategories = await fetchCategoriesByParent('Betriebsdienst');
        if (dbCategories && dbCategories.length > 0) {
          // Map to just category names for compatibility with existing code
          setCategories(dbCategories.map(cat => cat.name));
        } else {
          console.warn("No Betriebsdienst categories found in database, using fallback.");
          // Fallback to hardcoded categories if none found in DB
          setCategories([
            "Grundlagen Bahnbetrieb",
            "UVV & Arbeitsschutz",
            "Rangieren",
            "Züge fahren",
            "PZB & Sicherungsanlagen",
            "Kommunikation",
            "Besonderheiten",
            "Unregelmäßigkeiten"
          ]);
        }
      } catch (error) {
        console.error("Error loading Betriebsdienst categories:", error);
        // Fallback to hardcoded categories on error
        setCategories([
          "Grundlagen Bahnbetrieb",
          "UVV & Arbeitsschutz",
          "Rangieren",
          "Züge fahren",
          "PZB & Sicherungsanlagen",
          "Kommunikation",
          "Besonderheiten",
          "Unregelmäßigkeiten"
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);
  
  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Define which categories require PRO - this will be replaced by database isPro flag in the future
  const DEFAULT_PRO_CATEGORIES = [
    "Rangieren", 
    "Züge fahren", 
    "PZB & Sicherungsanlagen", 
    "Kommunikation", 
    "Besonderheiten", 
    "Unregelmäßigkeiten"
  ];

  return (
    <CategoryGrid
      categories={categories}
      categoryCardCounts={categoryCardCounts}
      progressStats={progressStats}
      selectedCategories={selectedCategories}
      onSelectCategory={onSelectCategory}
      isSelectable={isSelectable}
      regulationFilter={regulationFilter}
      isPro={!user} // If user is not logged in, all categories are treated as Pro (requiring login)
    />
  );
}
