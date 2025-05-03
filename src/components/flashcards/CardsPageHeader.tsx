
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
    <div className="mb-6 glass-card p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Karteikarten</h1>
          <p className="text-gray-300 max-w-2xl text-sm">
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
                className="h-7 w-7 p-0 rounded-full"
                onClick={onClearSelection}
              >
                <FilterX className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button 
              className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90 text-sm h-9 rounded-full px-4"
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
