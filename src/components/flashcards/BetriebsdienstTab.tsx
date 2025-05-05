
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/common/CategoryCard";
import { RegulationFilterType } from "@/types/regulation";
import { fetchCategoriesByParent, betriebsdienstSubCategories } from "@/api/categories";

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
      try {
        const dbCategories = await fetchCategoriesByParent('Betriebsdienst');
        if (dbCategories && dbCategories.length > 0) {
          setCategories(dbCategories.map(cat => cat.name));
        } else {
          // Fallback to hardcoded categories if none found in DB
          setCategories([...betriebsdienstSubCategories]);
        }
      } catch (error) {
        console.error("Error loading Betriebsdienst categories:", error);
        // Fallback to hardcoded categories on error
        setCategories([...betriebsdienstSubCategories]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Define which categories require PRO and which are locked without user
  const proCategories = ["Rangieren", "Züge fahren", "PZB & Sicherungsanlagen", "Kommunikation", "Besonderheiten", "Unregelmäßigkeiten"];
  
  if (isLoading) {
    return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
      ))}
    </div>;
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((subcategory) => {
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
                  : subcategory === "Züge fahren"
                    ? "Von der Abfahrt bis zur Ankunft"
                    : subcategory === "PZB & Sicherungsanlagen"
                      ? "Sicherungstechnik und PZB-System"
                      : subcategory === "Kommunikation"
                        ? "Betriebliche Kommunikation"
                        : subcategory === "Besonderheiten"
                          ? "Spezialfälle im Bahnbetrieb"
                          : "Störungen und außergewöhnliche Ereignisse"}
            progress={0}
            link={`/karteikarten/betriebsdienst/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
            isLocked={isLocked}
            isPro={isPro}
            isSelected={selectedCategories.includes(subcategory)}
            onSelect={() => onSelectCategory(subcategory)}
            selectable={!isLocked && isSelectable}
            stats={{
              totalCards: categoryCardCounts?.[subcategory] || 
                (subcategory === "Grundlagen Bahnbetrieb" ? 25 : 
                subcategory === "UVV & Arbeitsschutz" ? 18 : 
                subcategory === "Rangieren" ? 42 : 35),
              dueCards: !isLocked ? (progressStats?.[subcategory]?.dueCards || 0) : undefined,
              masteredCards: !isLocked ? (progressStats?.[subcategory]?.masteredCards || 0) : undefined
            }}
          />
        );
      })}
    </div>
  );
}
