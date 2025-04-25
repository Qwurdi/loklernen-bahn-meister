
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signalSubCategories } from "@/api/questions";

const betriebsdienstSubCategories = [
  "Grundlagen Bahnbetrieb",
  "UVV & Arbeitsschutz",
  "Rangieren",
  "Züge fahren",
  "PZB & Sicherungsanlagen",
  "Kommunikation",
  "Besonderheiten",
  "Unregelmäßigkeiten"
] as const;

interface QuestionSubCategorySelectorProps {
  category: "Signale" | "Betriebsdienst";
  subCategory: string;
  onSubCategoryChange: (value: string) => void;
}

export const QuestionSubCategorySelector = ({
  category,
  subCategory,
  onSubCategoryChange
}: QuestionSubCategorySelectorProps) => {
  const categories = category === "Signale" ? signalSubCategories : betriebsdienstSubCategories;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="sub-category">Unterkategorie</Label>
      <Select value={subCategory} onValueChange={onSubCategoryChange}>
        <SelectTrigger id="sub-category" className="w-full">
          <SelectValue placeholder="Wähle eine Unterkategorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
