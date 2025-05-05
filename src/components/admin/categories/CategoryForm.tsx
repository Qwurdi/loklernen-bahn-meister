
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import { QuestionCategory } from "@/types/questions";
import { Plus } from "lucide-react";

interface CategoryFormProps {
  parentCategory: QuestionCategory;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ parentCategory }) => {
  const { createCategory, isCreating } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    createCategory({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      parent_category: parentCategory
    });

    // Reset form after submission
    setFormData({
      name: "",
      description: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neue Kategorie hinzufügen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name der Kategorie"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung (optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Kurze Beschreibung der Kategorie"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreating || !formData.name.trim()}
          >
            {isCreating ? (
              "Kategorie wird erstellt..."
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Kategorie hinzufügen
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
