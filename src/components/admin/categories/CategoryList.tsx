
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/api/categories";
import { useCategories } from "@/hooks/useCategories";
import { QuestionCategory } from "@/types/questions";
import { Edit, Trash2, AlertTriangle, Folder, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryListProps {
  categories: Category[];
  parentCategory: QuestionCategory;
}

// Define the form schema for editing a category
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  isPro: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const CategoryList: React.FC<CategoryListProps> = ({ categories, parentCategory }) => {
  const { updateCategory, deleteCategory, isUpdating, isDeleting } = useCategories();
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  // Initialize the form for editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPro: false
    }
  });

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    form.reset({
      name: category.name,
      description: category.description || "",
      isPro: category.isPro || false
    });
  };

  const handleSaveEdit = (values: FormValues) => {
    if (!editCategory) return;

    updateCategory({
      id: editCategory.id,
      updates: {
        name: values.name,
        description: values.description || undefined,
        isPro: values.isPro
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
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500">
            <Folder className="h-12 w-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">Keine Kategorien gefunden</p>
            <p className="mt-1 text-sm text-gray-400">
              Fügen Sie neue Kategorien hinzu, um Ihre Fragen zu organisieren
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li 
                key={category.id} 
                className="p-4 hover:bg-gray-50 transition-colors duration-150 flex justify-between items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {category.name}
                    {category.isPro && (
                      <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black">
                        PRO
                      </Badge>
                    )}
                  </div>
                  {category.description && (
                    <div className="mt-1 text-sm text-gray-500 truncate">{category.description}</div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(category)}
                    className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Bearbeiten</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteClick(category)}
                    className="hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Löschen</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Edit Category Dialog */}
        <Dialog open={!!editCategory} onOpenChange={(open) => !open && setEditCategory(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kategorie bearbeiten</DialogTitle>
              <DialogDescription>
                Ändern Sie die Details der Kategorie
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveEdit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          className="border-gray-300 focus:border-loklernen-ultramarine focus:ring-loklernen-ultramarine/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          className="resize-y min-h-[80px] border-gray-300 focus:border-loklernen-ultramarine focus:ring-loklernen-ultramarine/20"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPro"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium">Pro-Kategorie</FormLabel>
                        <p className="text-sm text-gray-500">
                          Diese Kategorie ist nur für Pro-Nutzer verfügbar
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditCategory(null)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      'Speichern'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Kategorie löschen
              </AlertDialogTitle>
              <AlertDialogDescription>
                Sind Sie sicher, dass Sie die Kategorie <strong>"{categoryToDelete?.name}"</strong> löschen möchten?
                Diese Aktion kann nicht rückgängig gemacht werden. Alle Fragen in dieser Kategorie werden möglicherweise nicht mehr 
                korrekt kategorisiert.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Löschen...
                  </>
                ) : (
                  'Löschen'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
