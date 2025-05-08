import React from "react"; // Removed useEffect, useState
import { RegulationFilterType } from "@/types/regulation";
// import { fetchCategoriesByParent } from "@/api/categories/index"; // Removed
import { useCategories } from "@/hooks/useCategories"; // Added
// import { Category } from "@/api/categories/types"; // Implicitly typed
import CategoryGrid from "@/components/flashcards/CategoryGrid";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added
import { AlertCircle } from "lucide-react"; // Added

interface BetriebsdienstTabProps {
  progressStats?: Record<string, any>;
  categoryCardCounts?: Record<string, any>;
  selectedCategories: string[]; // This will likely change to Category[] or IDs later
  onSelectCategory: (categoryNameOrId: string) => void; // Keep as string for now
  isSelectable: boolean;
  regulationFilter: RegulationFilterType;
  user: any; // Kept as any to match existing, but should be User | null from Supabase
}

export default function BetriebsdienstTab({
  progressStats,
  categoryCardCounts,
  selectedCategories,
  onSelectCategory,
  isSelectable,
  regulationFilter,
  user // user prop is already here
}: BetriebsdienstTabProps) {
  const { 
    categories: allCategories, 
    isLoading: categoriesLoading, 
    error: categoriesError,
    categoriesByParent 
  } = useCategories();

  const betriebsdienstCategories = categoriesByParent('Betriebsdienst');

  if (categoriesLoading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler beim Laden der Betriebsdienstkategorien</AlertTitle>
        <AlertDescription>
          {categoriesError.message || "Ein unbekannter Fehler ist aufgetreten."}
        </AlertDescription>
      </Alert>
    );
  }

  // Fallback to a default set if API fails or returns empty for some reason,
  // but ideally, useCategories hook should handle this or provide a way to initialize.
  // For now, if betriebsdienstCategories is empty but no error, it means no categories are set up.
  // CategoryGrid should handle an empty categories array gracefully.
  
  // The DEFAULT_PRO_CATEGORIES array is removed as this logic will be handled by CategoryGrid
  // based on the isPro and requiresAuth flags from the Category objects.

  return (
    <CategoryGrid
      // Pass full category objects to CategoryGrid.
      // CategoryGrid will need to be updated to accept Category[]
      categories={betriebsdienstCategories}
      categoryCardCounts={categoryCardCounts}
      progressStats={progressStats}
      selectedCategories={selectedCategories}
      onSelectCategory={onSelectCategory}
      isSelectable={isSelectable}
      regulationFilter={regulationFilter}
      user={user} // user is already passed
      // parentCategoryType is for styling/theming inside CategoryGrid if needed
      parentCategoryType="Betriebsdienst"
    />
  );
}
