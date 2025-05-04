
import React from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CardsPageHeaderProps {
  user: any;
  selectedCategories: string[];
  onClearSelection: () => void;
  onStartLearningSelected: () => void;
}

export default function CardsPageHeader({
  user,
  selectedCategories,
  onClearSelection,
  onStartLearningSelected
}: CardsPageHeaderProps) {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Karteikarten</h1>
          <p className="text-gray-600 max-w-2xl text-sm">
            Lerne mit unseren Karteikarten und nutze das Spaced Repetition System für nachhaltigen Lernerfolg.
            {!user && " Melde dich an, um deinen Lernfortschritt zu speichern."}
          </p>
        </div>
        
        {user && selectedCategories.length > 0 && (
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="bg-loklernen-ultramarine text-white text-xs py-1 px-3 rounded-full border-loklernen-ultramarine/30"
              >
                {selectedCategories.length} {selectedCategories.length === 1 ? 'Kategorie' : 'Kategorien'} ausgewählt
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={onClearSelection}
              >
                <FilterX className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button 
              className="bg-gradient-ultramarine hover:opacity-90 transition-opacity text-white text-sm h-9 rounded-full px-4"
              onClick={onStartLearningSelected}
            >
              Ausgewählte Kategorien lernen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
