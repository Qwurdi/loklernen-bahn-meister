
import React from "react";
import CategoryCard from "@/components/common/CategoryCard";
import { RegulationFilterType } from "@/types/regulation";

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
  categoryCardCounts,
  progressStats,
  selectedCategories,
  onSelectCategory,
  isSelectable,
  regulationFilter,
  isPro = false,
}: CategoryGridProps) {
  // Filter categories based on regulation preference
  const visibleCategories = categories.filter(subcategory => {
    const cardCounts = categoryCardCounts?.[subcategory];
    
    if (regulationFilter !== "all" && cardCounts) {
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
  
  if (visibleCategories.length === 0) {
    return (
      <div className="text-center py-8 px-4 border border-gray-200 rounded-lg bg-white">
        <p className="text-gray-600">Keine Kategorien für das ausgewählte Regelwerk verfügbar.</p>
      </div>
    );
  }
  
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
        
        return (
          <CategoryCard
            key={subcategory}
            title={subcategory}
            description={stats 
              ? `${Math.round(progress)}% gelernt`
              : "Lerne die wichtigsten Signale dieser Kategorie"}
            progress={progress}
            link={`/karteikarten/signale/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
            isSelected={selectedCategories.includes(subcategory)}
            onSelect={() => onSelectCategory(subcategory)}
            selectable={isSelectable}
            stats={{
              totalCards,
              dueCards,
              masteredCards
            }}
            isPro={isPro}
            regulationCategory={regulationFilter !== "all" ? regulationFilter : undefined}
          />
        );
      })}
    </div>
  );
}
