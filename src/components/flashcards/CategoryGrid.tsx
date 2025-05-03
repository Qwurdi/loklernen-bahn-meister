
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
  console.log(`CategoryGrid - Rendering with ${categories.length} categories, filter: ${regulationFilter}`);
  console.log(`CategoryGrid - Category card counts:`, categoryCardCounts);
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((subcategory) => {
        const stats = progressStats?.[subcategory];
        const cardCounts = categoryCardCounts?.[subcategory];
        
        // Calculate progress percentage
        const progress = stats ? Math.round((stats.correct / Math.max(1, stats.total)) * 100) : 0;
        
        // Calculate card stats
        const totalCards = cardCounts?.total || 0;
        const dueCards = stats?.due || 0;
        const masteredCards = stats?.mastered || 0;
        
        // Filter by regulation if needed - improved logic
        let shouldDisplay = true;
        if (regulationFilter !== "all" && cardCounts) {
          // Include cards if they match the regulation OR have "Beide"/"both" regulation OR have no specific regulation set
          const hasCardsForRegulation = 
            (cardCounts.byRegulation[regulationFilter] > 0) || 
            (cardCounts.byRegulation["Beide"] > 0) || 
            (cardCounts.byRegulation["both"] > 0) ||
            (cardCounts.byRegulation["Allgemein"] > 0);
            
          shouldDisplay = hasCardsForRegulation;
        }
        
        // If no cardCounts available but we have a category, show it anyway
        if (!cardCounts) {
          console.log(`No card counts for category ${subcategory}`);
          shouldDisplay = true;
        }
        
        console.log(`Category ${subcategory} - Display: ${shouldDisplay}, Total: ${totalCards}, Due: ${dueCards}`);
        
        if (!shouldDisplay) return null;
        
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
          />
        );
      })}
    </div>
  );
}
