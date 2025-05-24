
import React from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CardsPageHeaderProps {
  selectedCategories: string[];
  onClearSelection: () => void;
  onStartLearningSelected: () => void;
}

export default function CardsPageHeader({
  selectedCategories,
  onClearSelection,
  onStartLearningSelected
}: CardsPageHeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearningGeneric = () => {
    // Start with Signale category for general learning
    navigate('/lernen?category=Signale&practice=true');
  };

  const handleGuestStartLearning = () => {
    navigate('/lernen?category=Signale&practice=true');
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Karteikarten</h1>
          <p className="text-gray-600 max-w-2xl text-sm">
            Lerne mit unseren Karteikarten und nutze das Spaced Repetition System für nachhaltigen Lernerfolg.
            {!user && " Melde dich an oder registriere dich, um deinen Lernfortschritt zu speichern und alle Funktionen zu nutzen."}
          </p>
        </div>
        
        {user ? (
          // Angemeldeter Nutzer
          selectedCategories.length > 0 ? (
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
          ) : (
            // Angemeldet, aber keine Kategorien ausgewählt
            <Button 
              className="bg-gradient-ultramarine hover:opacity-90 transition-opacity text-white text-sm h-9 rounded-full px-4"
              onClick={handleStartLearningGeneric}
            >
              Lernen starten
            </Button>
          )
        ) : (
          // Nicht angemeldeter Nutzer
          <div className="flex flex-col gap-2 items-end sm:items-center sm:flex-row">
            <Button 
              className="bg-gradient-ultramarine hover:opacity-90 transition-opacity text-white text-sm h-9 rounded-full px-4 w-full sm:w-auto"
              onClick={handleGuestStartLearning}
            >
              Signale kostenlos lernen
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-sm h-9 rounded-full px-4 w-full sm:w-auto"
            >
              Anmelden
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
