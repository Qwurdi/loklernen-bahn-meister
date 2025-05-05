
import { QuestionCategory } from "@/types/questions";
import { supabase } from "@/integrations/supabase/client";
import { Category, signalSubCategories, betriebsdienstSubCategories } from "./types";
import { getCachedCategories, setCachedCategories, clearCategoriesCache } from "./cache";

// Fetch all categories from the database
export async function fetchCategories(): Promise<Category[]> {
  const cachedCategories = getCachedCategories();
  if (cachedCategories) return cachedCategories;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  setCachedCategories(data as Category[]);
  return data as Category[];
}

// Fetch categories by parent category
export async function fetchCategoriesByParent(parentCategory: QuestionCategory): Promise<Category[]> {
  const categories = await fetchCategories();
  return categories.filter(category => category.parent_category === parentCategory);
}

// Get Signale subcategories
export async function fetchSignalCategories(): Promise<Category[]> {
  return fetchCategoriesByParent('Signale');
}

// Get Betriebsdienst subcategories
export async function fetchBetriebsdienstCategories(): Promise<Category[]> {
  return fetchCategoriesByParent('Betriebsdienst');
}
