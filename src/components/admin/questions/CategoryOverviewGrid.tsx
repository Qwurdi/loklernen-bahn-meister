
import React from "react";
import { Question } from "@/types/questions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signalSubCategories } from "@/api/questions";

interface CategoryOverviewGridProps {
  questions: Question[];
  activeCategory: "Signale" | "Betriebsdienst" | "all";
  activeSubCategory: string | null;
  onCategorySelect: (category: "Signale" | "Betriebsdienst" | "all") => void;
  onSubCategorySelect: (subCategory: string | null) => void;
}

const betriebsdienstSubCategories = [
  "Grundlagen Bahnbetrieb",
  "UVV & Arbeitsschutz",
  "Rangieren",
  "Züge fahren",
  "PZB & Sicherungsanlagen",
  "Kommunikation",
  "Besonderheiten",
  "Unregelmäßigkeiten"
];

export const CategoryOverviewGrid: React.FC<CategoryOverviewGridProps> = ({
  questions,
  activeCategory,
  activeSubCategory,
  onCategorySelect,
  onSubCategorySelect
}) => {
  // Group questions by subcategory and count them
  const getSubcategoryCounts = (mainCategory: "Signale" | "Betriebsdienst") => {
    const counts: Record<string, number> = {};
    const filteredQuestions = questions.filter(q => q.category === mainCategory);
    
    filteredQuestions.forEach(question => {
      const subCat = question.sub_category;
      counts[subCat] = (counts[subCat] || 0) + 1;
    });
    
    return counts;
  };
  
  const signalCounts = getSubcategoryCounts("Signale");
  const betriebsdienstCounts = getSubcategoryCounts("Betriebsdienst");
  
  const totalSignals = Object.values(signalCounts).reduce((sum, count) => sum + count, 0);
  const totalBetriebsdienst = Object.values(betriebsdienstCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => {
            onCategorySelect("all");
            onSubCategorySelect(null);
          }}
        >
          Alle Fragen ({questions.length})
        </Button>
        <Button 
          variant={activeCategory === "Signale" && !activeSubCategory ? "default" : "outline"}
          onClick={() => {
            onCategorySelect("Signale");
            onSubCategorySelect(null);
          }}
          className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900"
        >
          Signale ({totalSignals})
        </Button>
        <Button 
          variant={activeCategory === "Betriebsdienst" && !activeSubCategory ? "default" : "outline"}
          onClick={() => {
            onCategorySelect("Betriebsdienst");
            onSubCategorySelect(null);
          }}
          className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900"
        >
          Betriebsdienst ({totalBetriebsdienst})
        </Button>
      </div>
      
      {activeCategory === "Signale" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {signalSubCategories.map(subCategory => (
            <Card 
              key={subCategory}
              className={`cursor-pointer transition-all ${
                activeSubCategory === subCategory ? "border-blue-500 ring-1 ring-blue-500" : "hover:border-blue-300"
              }`}
              onClick={() => onSubCategorySelect(subCategory)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium line-clamp-2">{subCategory}</h3>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {signalCounts[subCategory] || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {activeCategory === "Betriebsdienst" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {betriebsdienstSubCategories.map(subCategory => (
            <Card 
              key={subCategory}
              className={`cursor-pointer transition-all ${
                activeSubCategory === subCategory ? "border-green-500 ring-1 ring-green-500" : "hover:border-green-300"
              }`}
              onClick={() => onSubCategorySelect(subCategory)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium line-clamp-2">{subCategory}</h3>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {betriebsdienstCounts[subCategory] || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
