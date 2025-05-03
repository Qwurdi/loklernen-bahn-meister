
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface LearningPlanSectionProps {
  selectedCategories: string[];
  onStartLearning: () => void;
  onRemoveCategory: (subcategory: string) => void;
}

export default function LearningPlanSection({
  selectedCategories,
  onStartLearning,
  onRemoveCategory
}: LearningPlanSectionProps) {
  if (selectedCategories.length === 0) return null;
  
  return (
    <div className="mt-6 rounded-lg border border-gray-800 bg-black/30 p-4">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="font-medium">Dein Lernplan</h3>
        <Button 
          variant="outline" 
          className="h-8 text-sm bg-gradient-to-r from-loklernen-ultramarine/90 to-loklernen-sapphire/90 border-none text-white px-4"
          onClick={onStartLearning}
        >
          Jetzt lernen
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map(category => (
          <Badge 
            key={category} 
            variant="outline"
            className="pl-3 pr-2 py-1.5 bg-gray-800/50 border-gray-700 text-white flex items-center group gap-1"
          >
            <span>{category}</span>
            <button 
              className="ml-1 bg-transparent border-none p-0.5 rounded-full opacity-70 group-hover:opacity-100 hover:bg-gray-700 transition-colors"
              onClick={() => onRemoveCategory(category)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
