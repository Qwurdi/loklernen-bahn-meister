
import { QuestionCategory } from "@/types/questions";
import { supabase } from "@/integrations/supabase/client";

// Type definition for categories
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parent_category: QuestionCategory;
  created_at?: string;
  updated_at?: string;
}

// Cache for categories to avoid multiple fetches
let cachedCategories: Category[] | null = null;

// Fetch all categories from the database
export async function fetchCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  cachedCategories = data;
  return data;
}

// Clear the categories cache
export function clearCategoriesCache() {
  cachedCategories = null;
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
  return data;
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
  return data;
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

// Initialize default categories if none exist
export async function initializeDefaultCategories(userId: string): Promise<void> {
  const { count, error } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("Error checking categories:", error);
    throw error;
  }

  // If categories already exist, don't initialize
  if (count && count > 0) return;

  // Default Signale categories based on signalSubCategories
  const signalCategories = [
    "Allgemeine Bestimmungen",
    "Hp-Signale",
    "Kombinationssignale (Ks)",
    "Lichthaupt- und Lichtvorsignale (Hl)",
    "Haupt- und Vorsignalverbindungen (Sv)",
    "Vr-Signale",
    "Zusatzsignale (Zs)",
    "Signale für Schiebelokomotiven und Sperrfahrten (Ts)",
    "Langsamfahrsignale (Lf)",
    "Schutzsignale (Sh)",
    "Signale für den Rangierdienst (Ra)",
    "Weichensignale (Wn)",
    "Signale für das Zugpersonal (Zp)",
    "Fahrleitungssignale (El)",
    "Signale an Zügen (Zg)",
    "Signale an einzelnen Fahrzeugen (Fz)",
    "Nebensignale (Ne)",
    "Signale für Bahnübergänge (Bü)",
    "Orientierungszeichen",
    "Signalkombinationen (Sk)"
  ];

  // Default Betriebsdienst categories
  const betriebsdienstCategories = [
    "Grundlagen Bahnbetrieb",
    "UVV & Arbeitsschutz",
    "Rangieren",
    "Züge fahren",
    "PZB & Sicherungsanlagen",
    "Kommunikation",
    "Besonderheiten",
    "Unregelmäßigkeiten"
  ];

  // Initialize all Signale categories
  for (const name of signalCategories) {
    await createCategory({
      name,
      parent_category: 'Signale',
      description: `Fragen zu ${name}`,
    });
  }

  // Initialize all Betriebsdienst categories
  for (const name of betriebsdienstCategories) {
    await createCategory({
      name,
      parent_category: 'Betriebsdienst',
      description: name === "Grundlagen Bahnbetrieb" 
        ? "Einstieg in den Bahnbetrieb"
        : name === "UVV & Arbeitsschutz"
          ? "Sicherheit am Arbeitsplatz"
          : name === "Rangieren"
            ? "Alles zum Thema Rangieren"
            : name === "Züge fahren"
              ? "Von der Abfahrt bis zur Ankunft"
              : `Fragen zum Thema ${name}`,
    });
  }
}

// Fallback in case database is not available
export const signalSubCategories = [
  "Allgemeine Bestimmungen",
  "Hp-Signale",
  "Kombinationssignale (Ks)",
  "Lichthaupt- und Lichtvorsignale (Hl)",
  "Haupt- und Vorsignalverbindungen (Sv)",
  "Vr-Signale",
  "Zusatzsignale (Zs)",
  "Signale für Schiebelokomotiven und Sperrfahrten (Ts)",
  "Langsamfahrsignale (Lf)",
  "Schutzsignale (Sh)",
  "Signale für den Rangierdienst (Ra)",
  "Weichensignale (Wn)",
  "Signale für das Zugpersonal (Zp)",
  "Fahrleitungssignale (El)",
  "Signale an Zügen (Zg)",
  "Signale an einzelnen Fahrzeugen (Fz)",
  "Nebensignale (Ne)",
  "Signale für Bahnübergänge (Bü)",
  "Orientierungszeichen",
  "Signalkombinationen (Sk)"
] as const;

export const betriebsdienstSubCategories = [
  "Grundlagen Bahnbetrieb",
  "UVV & Arbeitsschutz",
  "Rangieren",
  "Züge fahren",
  "PZB & Sicherungsanlagen",
  "Kommunikation",
  "Besonderheiten",
  "Unregelmäßigkeiten"
] as const;
