
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchCategories, 
  fetchCategoriesByParent, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  Category 
} from "@/api/categories";
import { QuestionCategory } from "@/types/questions";
import { toast } from "sonner";

export function useCategories() {
  const queryClient = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const categoriesByParent = (parent: QuestionCategory) => {
    return categories?.filter(cat => cat.parent_category === parent) || [];
  };

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Kategorie erfolgreich erstellt");
    },
    onError: (error) => {
      toast.error(`Fehler beim Erstellen der Kategorie: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>> }) => 
      updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Kategorie erfolgreich aktualisiert");
    },
    onError: (error) => {
      toast.error(`Fehler beim Aktualisieren der Kategorie: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Kategorie erfolgreich gelöscht");
    },
    onError: (error) => {
      toast.error(`Fehler beim Löschen der Kategorie: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  });

  return {
    categories,
    isLoading,
    error,
    categoriesByParent,
    signaleCategories: categoriesByParent('Signale'),
    betriebsdienstCategories: categoriesByParent('Betriebsdienst'),
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending
  };
}
