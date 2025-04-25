
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { QuestionCategory } from '@/types/questions';

interface QuestionCategorySelectorProps {
  category: QuestionCategory;
  onCategoryChange: (category: QuestionCategory) => void;
}

export const QuestionCategorySelector = ({ category, onCategoryChange }: QuestionCategorySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Kategorie</Label>
      <div className="flex gap-2">
        <Button 
          type="button"
          variant={category === "Signale" ? "default" : "outline"}
          onClick={() => onCategoryChange("Signale")}
          className="flex-1"
        >
          Signale
        </Button>
        <Button 
          type="button"
          variant={category === "Betriebsdienst" ? "default" : "outline"}
          onClick={() => onCategoryChange("Betriebsdienst")}
          className="flex-1"
        >
          Betriebsdienst
        </Button>
      </div>
    </div>
  );
};
