
import React from "react";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Signal, BookOpen } from "lucide-react";
import SignaleTab from "./SignaleTab";
import BetriebsdienstTab from "./BetriebsdienstTab";
import { RegulationFilterType } from "@/types/regulation";

interface CardDecksSectionProps {
  user: any;
  activeTab: "signale" | "betriebsdienst";
  onTabChange: (value: string) => void;
  selectedCategories: string[];
  onSelectCategory: (subcategory: string) => void;
  regulationFilter: RegulationFilterType;
  onRegulationFilterChange: (value: RegulationFilterType) => void;
  progressStats?: Record<string, any>;
  categoryCardCounts?: Record<string, any>;
}

export default function CardDecksSection({
  user,
  activeTab,
  onTabChange,
  selectedCategories,
  onSelectCategory,
  regulationFilter,
  onRegulationFilterChange,
  progressStats,
  categoryCardCounts
}: CardDecksSectionProps) {
  return (
    <>
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h2 className="text-xl font-semibold">Kartendecks</h2>
          
          {user && (
            <div className="flex gap-2 items-center">
              <RegulationFilterToggle
                value={regulationFilter}
                onChange={onRegulationFilterChange}
                title=""
                showInfoTooltip={false}
                variant="outline"
                size="sm"
                showAllOption
                className="w-auto"
              />
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Wähle die Kategorien aus, die du lernen möchtest. Du kannst mehrere Kategorien gleichzeitig auswählen.
        </p>
      </div>

      <Tabs 
        defaultValue="signale" 
        value={activeTab}
        onValueChange={onTabChange}
        className="mb-8"
      >
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="signale" className="flex-1">
            <Signal className="h-4 w-4 mr-2" />
            Signale
          </TabsTrigger>
          <TabsTrigger value="betriebsdienst" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            Betriebsdienst
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signale">
          <SignaleTab
            progressStats={progressStats}
            categoryCardCounts={categoryCardCounts}
            selectedCategories={selectedCategories}
            onSelectCategory={onSelectCategory}
            isSelectable={!!user}
            regulationFilter={regulationFilter}
          />
        </TabsContent>
        
        <TabsContent value="betriebsdienst">
          <BetriebsdienstTab
            progressStats={progressStats}
            categoryCardCounts={categoryCardCounts}
            selectedCategories={selectedCategories}
            onSelectCategory={onSelectCategory}
            isSelectable={!!user}
            regulationFilter={regulationFilter}
            user={user}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
