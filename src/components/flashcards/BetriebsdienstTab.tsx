
import React from "react";
import CategoryCard from "@/components/common/CategoryCard";
import { RegulationFilterType } from "@/types/regulation";

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
  // Define basic betriebsdienst categories
  const betriebsdienstCategories = [
    "Grundlagen Bahnbetrieb",
    "UVV & Arbeitsschutz",
    "Rangieren",
    "Züge fahren"
  ];
  
  // Define which categories require PRO and which are locked without user
  const proCategories = ["Rangieren", "Züge fahren"];
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {betriebsdienstCategories.map((subcategory) => {
        const isPro = proCategories.includes(subcategory);
        const isLocked = !user || isPro;
        
        return (
          <CategoryCard
            key={subcategory}
            title={subcategory}
            description={subcategory === "Grundlagen Bahnbetrieb" 
              ? "Einstieg in den Bahnbetrieb" 
              : subcategory === "UVV & Arbeitsschutz" 
                ? "Sicherheit am Arbeitsplatz"
                : subcategory === "Rangieren"
                  ? "Alles zum Thema Rangieren"
                  : "Von der Abfahrt bis zur Ankunft"}
            progress={0}
            link={`/karteikarten/betriebsdienst/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
            isLocked={isLocked}
            isPro={isPro}
            isSelected={selectedCategories.includes(subcategory)}
            onSelect={() => onSelectCategory(subcategory)}
            selectable={!isLocked && isSelectable}
            stats={{
              totalCards: subcategory === "Grundlagen Bahnbetrieb" ? 25 : 
                subcategory === "UVV & Arbeitsschutz" ? 18 : 
                subcategory === "Rangieren" ? 42 : 35,
              dueCards: !isLocked ? 0 : undefined,
              masteredCards: !isLocked ? 0 : undefined
            }}
          />
        );
      })}
    </div>
  );
}
