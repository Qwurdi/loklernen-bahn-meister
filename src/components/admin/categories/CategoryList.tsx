import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/api/categories/index";
import { useCategories } from "@/hooks/useCategories";
import { QuestionCategory } from "@/types/questions";
import CategoryListItem from "./CategoryListItem";
import CategoryEditDialog from "./CategoryEditDialog";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import CategoryEmptyState from "./CategoryEmptyState";
import { CategoryFormValues } from "./CategoryEditDialog";

interface CategoryListProps {
  categories: Category[];
  parentCategory: QuestionCategory;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, parentCategory }) => {
  const { updateCategory, deleteCategory, isUpdating, isDeleting } = useCategories();
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const handleEdit = (category: Category) => {
    setEditCategory(category);
  };

  const handleSaveEdit = (values: CategoryFormValues) => {
    if (!editCategory) return;

    updateCategory({
      id: editCategory.id,
      updates: {
        name: values.name,
        description: values.description || undefined,
        isPro: values.isPro,
        isPlanned: values.isPlanned,
        requiresAuth: values.requiresAuth // Neues Feld hinzugefügt
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

  // Color mapping for parent categories
  const colorMap = {
    Signale: "bg-loklernen-ultramarine/10 text-loklernen-ultramarine border-loklernen-ultramarine/20",
    Betriebsdienst: "bg-loklernen-betriebsdienst/10 text-loklernen-betriebsdienst border-loklernen-betriebsdienst/20"
  };

  const parentColor = parentCategory === "Signale" ? colorMap.Signale : colorMap.Betriebsdienst;

  return (
    <Card className="shadow-md border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className={`bg-gradient-to-r from-${parentCategory === "Signale" ? "loklernen-ultramarine/10" : "loklernen-betriebsdienst/10"} to-transparent rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={parentCategory === "Signale" ? "text-loklernen-ultramarine" : "text-loklernen-betriebsdienst"}>
              {parentCategory === "Signale" ? "Signal-Kategorien" : "Betriebsdienst-Kategorien"}
            </CardTitle>
            <CardDescription>
              Verwalten Sie die {parentCategory.toLowerCase()} Kategorien
            </CardDescription>
          </div>
          <Badge variant="outline" className={parentColor}>
            {categories.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {categories.length === 0 ? (
          <CategoryEmptyState />
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <CategoryListItem
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </ul>
        )}

        {/* Edit Category Dialog */}
        <CategoryEditDialog
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
          category={editCategory}
          onSave={handleSaveEdit}
          isUpdating={isUpdating}
        />

        {/* Delete Confirmation Dialog */}
        <CategoryDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          category={categoryToDelete}
          onConfirmDelete={confirmDelete}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryList;
