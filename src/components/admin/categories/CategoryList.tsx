
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Category } from "@/api/categories";
import { useCategories } from "@/hooks/useCategories";
import { QuestionCategory } from "@/types/questions";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CategoryListProps {
  categories: Category[];
  parentCategory: QuestionCategory;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, parentCategory }) => {
  const { updateCategory, deleteCategory, isUpdating, isDeleting } = useCategories();
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [editValues, setEditValues] = useState({
    name: "",
    description: ""
  });

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setEditValues({
      name: category.name,
      description: category.description || ""
    });
  };

  const handleSaveEdit = () => {
    if (!editCategory) return;

    updateCategory({
      id: editCategory.id,
      updates: {
        name: editValues.name,
        description: editValues.description || undefined
      }
    });
    setEditCategory(null);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {parentCategory === "Signale" ? "Signal-Kategorien" : "Betriebsdienst-Kategorien"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Keine Kategorien gefunden. Fügen Sie neue Kategorien hinzu.
          </div>
        ) : (
          <ul className="divide-y">
            {categories.map((category) => (
              <li key={category.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-base">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Edit Category Dialog */}
        <Dialog open={!!editCategory} onOpenChange={(open) => !open && setEditCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kategorie bearbeiten</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name"
                  value={editValues.name}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Beschreibung (optional)</Label>
                <Textarea 
                  id="edit-description"
                  value={editValues.description}
                  onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditCategory(null)}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isUpdating || !editValues.name.trim()}
              >
                {isUpdating ? "Speichert..." : "Speichern"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Kategorie löschen
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Sind Sie sicher, dass Sie die Kategorie <strong>"{categoryToDelete?.name}"</strong> löschen möchten?
              </p>
              <p className="mt-2 text-red-500 text-sm">
                Diese Aktion kann nicht rückgängig gemacht werden. Alle Fragen in dieser Kategorie werden möglicherweise nicht mehr korrekt kategorisiert.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Abbrechen
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Löscht..." : "Löschen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
