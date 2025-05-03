
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
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Karteikarten</h1>
        <p className="text-gray-500 max-w-2xl">
          Lerne mit unseren Karteikarten und nutze das Spaced Repetition System für nachhaltigen Lernerfolg.
          {!user && " Melde dich an, um deinen Lernfortschritt zu speichern."}
        </p>
      </div>
      
      {user && selectedCategories.length > 0 && (
        <div className="flex flex-col gap-2 items-end">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-loklernen-ultramarine text-white">
              {selectedCategories.length} Kategorien ausgewählt
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearSelection}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
            onClick={onStartLearningSelected}
          >
            Ausgewählte Kategorien lernen
          </Button>
        </div>
      )}
    </div>
  );
}
