import React from "react";
import { useCategories } from "@/hooks/useCategories";
// import { Category } from "@/api/categories/types"; // Category is implicitly typed by useCategories
import CategoryGrid from "./CategoryGrid";
import { RegulationFilterType } from "@/types/regulation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { User } from "@supabase/supabase-js"; // Added for user prop type

interface SignaleTabProps {
  progressStats?: Record<string, any>;
  categoryCardCounts?: Record<string, any>;
  selectedCategories: string[];
  onSelectCategory: (categoryNameOrId: string) => void;
  isSelectable: boolean;
  regulationFilter: RegulationFilterType;
  user: User | null; // Added user prop
}

export default function SignaleTab({
  progressStats,
  categoryCardCounts,
  selectedCategories,
  onSelectCategory,
  isSelectable,
  regulationFilter,
  user // Added
}: SignaleTabProps) {
  const { 
    categories: allCategories, 
    isLoading: categoriesLoading, 
    error: categoriesError,
    categoriesByParent 
  } = useCategories();

  const signalCategories = categoriesByParent('Signale');

  if (categoriesLoading) {
    return <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
      ))}
    </div>;
  }

  if (categoriesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler beim Laden der Signalkategorien</AlertTitle>
        <AlertDescription>
          {categoriesError.message || "Ein unbekannter Fehler ist aufgetreten."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <CategoryGrid
      categories={signalCategories}
      progressStats={progressStats}
      categoryCardCounts={categoryCardCounts}
      selectedCategories={selectedCategories}
      onSelectCategory={onSelectCategory}
      isSelectable={isSelectable}
      regulationFilter={regulationFilter}
      parentCategoryType="Signale"
      user={user} // Pass user to CategoryGrid
    />
  );
}
