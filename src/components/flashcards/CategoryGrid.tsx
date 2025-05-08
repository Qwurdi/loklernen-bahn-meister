import React from "react";
import CategoryCard from "@/components/common/CategoryCard";
import { RegulationFilterType } from "@/types/regulation";
import { filterCategoriesByRegulation } from "./CategoryRegulationFilter";
import EmptyRegulationState from "./EmptyRegulationState";
import { Category } from "@/api/categories/types";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";

interface CategoryStats {
  correct: number;
  total: number;
  due: number;
  mastered: number;
  regulationStats: Record<string, number>;
}

interface CategoryCardCounts {
  total: number;
  byRegulation: Record<string, number>;
}

interface CategoryGridProps {
  categories: Category[];
  categoryCardCounts?: Record<string, CategoryCardCounts>;
  progressStats?: Record<string, CategoryStats>;
  selectedCategories: string[];
  onSelectCategory: (categoryIdentifier: string) => void;
  isSelectable: boolean;
  regulationFilter: RegulationFilterType;
  user: User | null;
  parentCategoryType: "Signale" | "Betriebsdienst";
}

export default function CategoryGrid({
  categories,
  categoryCardCounts,
  progressStats,
  selectedCategories,
  onSelectCategory,
  isSelectable,
  regulationFilter,
  user,
  parentCategoryType,
}: CategoryGridProps) {
  const visibleCategories = filterCategoriesByRegulation(
    categories, 
    regulationFilter, 
    categoryCardCounts
  );
  
  if (visibleCategories.length === 0 && categories.length > 0) {
    return <EmptyRegulationState regulation={regulationFilter} />;
  }
  
  if (categories.length === 0) {
     return (
      <div className="text-center py-10 text-gray-500">
        <p>Für den Bereich "{parentCategoryType}" sind aktuell keine Kategorien verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visibleCategories.map((category) => {
        const stats = progressStats?.[category.name];
        const cardCounts = categoryCardCounts?.[category.name];
        
        const progress = stats ? Math.round((stats.correct / Math.max(1, stats.total)) * 100) : 0;
        
        const totalCards = cardCounts?.total || 0;
        const dueCards = stats?.due || 0;
        const masteredCards = stats?.mastered || 0;
        
        const isUserPro = !!user?.user_metadata?.is_pro_member || !!user?.app_metadata?.is_pro; 

        let isLocked = false;
        if (category.requiresAuth && !user) {
          isLocked = true;
        } else if (category.isPro && !isUserPro) {
          isLocked = true;
        }

        const categoryLink = `/karteikarten/lernen?category=${encodeURIComponent(category.id)}`;

        return (
          <CategoryCard
            key={category.id}
            title={category.name}
            description={
              category.description || 
              (stats 
                ? `${Math.round(progress)}% gelernt`
                : category.isPlanned 
                  ? "Demnächst verfügbar" 
                  : `Lerne die Grundlagen für ${category.name}`)
            }
            progress={progress}
            link={categoryLink}
            isSelected={selectedCategories.includes(category.name) || selectedCategories.includes(category.id)}
            onSelect={() => onSelectCategory(category.name)}
            selectable={isSelectable && !isLocked}
            isLocked={isLocked}
            isPro={category.isPro}
            isPlanned={category.isPlanned}
            requiresAuth={category.requiresAuth}
            stats={{
              totalCards,
              dueCards,
              masteredCards
            }}
            regulationCategory={regulationFilter !== "all" ? regulationFilter : undefined}
            parentCategoryType={parentCategoryType}
          />
        );
      })}
    </div>
  );
}
