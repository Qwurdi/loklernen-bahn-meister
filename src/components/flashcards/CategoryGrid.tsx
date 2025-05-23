
import React from "react";
import CategoryCard from "@/components/common/CategoryCard";
import { RegulationFilterType } from "@/types/regulation";
import { useCategoryMetadata } from "./useCategoryMetadata";
import { filterCategoriesByRegulation } from "./CategoryRegulationFilter";
import EmptyRegulationState from "./EmptyRegulationState";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedNavigation } from "@/hooks/navigation/useUnifiedNavigation";

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
  categories: string[];
  categoryCardCounts?: Record<string, CategoryCardCounts>;
  progressStats?: Record<string, CategoryStats>;
  selectedCategories: string[];
  onSelectCategory: (subcategory: string) => void;
  isSelectable: boolean;
  regulationFilter: RegulationFilterType;
  isPro?: boolean;
}

export default function CategoryGrid({
  categories,
  progressStats,
  categoryCardCounts,
  selectedCategories,
  onSelectCategory,
  isSelectable,
  regulationFilter,
  isPro
}: CategoryGridProps) {
  const { user } = useAuth();
  const { navigateToLearning } = useUnifiedNavigation();
  
  const { categoryMetadata, isLoading } = useCategoryMetadata(categories);
  
  // Filter categories based on regulation preference - Updated parameter order
  const visibleCategories = filterCategoriesByRegulation(categories, regulationFilter, categoryCardCounts);
  
  if (visibleCategories.length === 0) {
    return <EmptyRegulationState />;
  }
  
  const handleCategoryClick = (categoryName: string) => {
    if (isSelectable) {
      onSelectCategory(categoryName);
      return;
    }

    // Use new unified navigation
    navigateToLearning({
      subcategory: categoryName,
      regulation: regulationFilter !== 'all' ? regulationFilter : undefined
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleCategories.map((subcategory) => {
        const stats = progressStats?.[subcategory];
        const cardCounts = categoryCardCounts?.[subcategory];
        
        // Calculate progress percentage
        const progress = stats ? Math.round((stats.correct / Math.max(1, stats.total)) * 100) : 0;
        
        // Calculate card stats
        const totalCards = cardCounts?.total || 0;
        const dueCards = stats?.due || 0;
        const masteredCards = stats?.mastered || 0;
        
        // Get category metadata
        const metadata = categoryMetadata[subcategory] || { isPro: false, isPlanned: false };
        const isCategoryPro = metadata.isPro;
        const isCategoryPlanned = metadata.isPlanned;
        
        return (
          <CategoryCard
            key={subcategory}
            title={subcategory}
            description={stats 
              ? `${Math.round(progress)}% gelernt`
              : isCategoryPlanned 
                ? "Demnächst verfügbar" 
                : "Lerne die wichtigsten Signale dieser Kategorie"}
            progress={progress}
            link={`/karteikarten/${subcategory.toLowerCase().includes('signal') ? 'signale' : 'betriebsdienst'}/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
            isSelected={selectedCategories.includes(subcategory)}
            onSelect={() => handleCategoryClick(subcategory)}
            selectable={isSelectable}
            isLocked={isPro && isCategoryPro}
            isPro={isCategoryPro}
            isPlanned={isCategoryPlanned}
            stats={{
              totalCards,
              dueCards,
              masteredCards
            }}
            regulationCategory={regulationFilter !== "all" ? regulationFilter : undefined}
          />
        );
      })}
    </div>
  );
}
