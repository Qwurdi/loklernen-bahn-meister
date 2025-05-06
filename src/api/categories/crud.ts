
import { supabase } from "@/integrations/supabase/client";
import { Category } from "./types";
import { clearCategoriesCache } from "./cache";

// Create a new category
export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw error;
  }

  clearCategoriesCache();
  return data as Category;
}

// Update a category
export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw error;
  }

  clearCategoriesCache();
  return data as Category;
}

// Delete a category
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting category:", error);
    throw error;
  }

  clearCategoriesCache();
}
