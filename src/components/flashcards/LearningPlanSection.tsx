
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface LearningPlanSectionProps {
  selectedCategories: string[];
  onStartLearning: () => void;
  onRemoveCategory: (category: string) => void;
}

export default function LearningPlanSection({
  selectedCategories,
  onStartLearning,
  onRemoveCategory
}: LearningPlanSectionProps) {
  const { regulationPreference } = useUserPreferences();
  
  if (selectedCategories.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8 p-4 border border-gray-800 rounded-lg bg-gray-900">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-1">Dein Lernplan</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCategories.map(cat => (
              <Badge key={cat} variant="secondary" className="bg-gray-700 text-white">
                {cat}
                <button 
                  onClick={() => onRemoveCategory(cat)}
                  className="ml-1 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            Regelwerk: {regulationPreference}
          </p>
        </div>
        <Button
          className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
          onClick={onStartLearning}
        >
          Mit diesem Plan lernen
        </Button>
      </div>
    </div>
  );
}
