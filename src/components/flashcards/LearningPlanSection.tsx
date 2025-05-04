
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
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Dein Lernplan</h3>
        <Button 
          className="bg-gradient-ultramarine hover:opacity-90 transition-opacity text-white px-4"
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
            className="pl-3 pr-2 py-1.5 bg-gray-100 border-gray-200 text-gray-700 flex items-center group gap-1"
          >
            <span>{category}</span>
            <button 
              className="ml-1 bg-transparent border-none p-0.5 rounded-full opacity-70 group-hover:opacity-100 hover:bg-gray-200 transition-colors"
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
