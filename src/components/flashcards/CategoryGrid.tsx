
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/common/CategoryCard";
import { RegulationFilterType } from "@/types/regulation";
import { fetchCategoriesByParent } from "@/api/categories";

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
  const [categoryMetadata, setCategoryMetadata] = useState<Record<string, { isPro: boolean, isPlanned: boolean }>>({});
  
  // Fetch categories to determine which are pro and which are planned
  useEffect(() => {
    const fetchCategoryMetadata = async () => {
      try {
        const parent = categories.some(cat => 
          ["Rangieren", "Züge fahren", "PZB & Sicherungsanlagen"].includes(cat)
        ) ? 'Betriebsdienst' : 'Signale';
        
        const dbCategories = await fetchCategoriesByParent(parent);
        
        // Create a map of category name to metadata (isPro and isPlanned status)
        const metadataMap = dbCategories.reduce((map: Record<string, { isPro: boolean, isPlanned: boolean }>, cat) => {
          map[cat.name] = { 
            isPro: !!cat.isPro,
            isPlanned: !!cat.isPlanned
          };
          return map;
        }, {});
        
        setCategoryMetadata(metadataMap);
      } catch (error) {
        console.error("Error fetching category metadata:", error);
        // Fallback for Betriebsdienst categories that are typically Pro
        if (categories.some(cat => ["Rangieren", "Züge fahren"].includes(cat))) {
          const DEFAULT_PRO_CATEGORIES = [
            "Rangieren", 
            "Züge fahren", 
            "PZB & Sicherungsanlagen", 
            "Kommunikation", 
            "Besonderheiten", 
            "Unregelmäßigkeiten"
          ];
          
          const fallbackMap = categories.reduce((map: Record<string, { isPro: boolean, isPlanned: boolean }>, cat) => {
            map[cat] = { 
              isPro: DEFAULT_PRO_CATEGORIES.includes(cat),
              isPlanned: false // Default to false for isPlanned in fallback
            };
            return map;
          }, {});
          
          setCategoryMetadata(fallbackMap);
        }
      }
    };
    
    fetchCategoryMetadata();
  }, [categories]);
  
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
            onSelect={() => onSelectCategory(subcategory)}
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
