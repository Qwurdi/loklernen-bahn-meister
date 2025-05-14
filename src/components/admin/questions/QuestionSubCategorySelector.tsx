import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategoriesByParent, signalSubCategories, betriebsdienstSubCategories } from "@/api/categories/index";

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
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const dbCategories = await fetchCategoriesByParent(category);
        if (dbCategories && dbCategories.length > 0) {
          setCategories(dbCategories.map(cat => cat.name));
        } else {
          // Fallback to hardcoded categories if none found in DB
          setCategories(category === "Signale" ? [...signalSubCategories] : [...betriebsdienstSubCategories]);
        }
      } catch (error) {
        console.error(`Error loading ${category} categories:`, error);
        // Fallback to hardcoded categories on error
        setCategories(category === "Signale" ? [...signalSubCategories] : [...betriebsdienstSubCategories]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [category]);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="sub-category">Unterkategorie</Label>
      <Select value={subCategory} onValueChange={onSubCategoryChange} disabled={isLoading}>
        <SelectTrigger id="sub-category" className="w-full">
          <SelectValue placeholder={isLoading ? "Lade Kategorien..." : "Wähle eine Unterkategorie"} />
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
