
import { createCategory } from "./crud";
import { signalSubCategories, betriebsdienstSubCategories } from "./types";

// Initialize default categories if none exist
export async function initializeDefaultCategories(userId: string): Promise<void> {
  const { supabase } = await import("@/integrations/supabase/client");
  
  const { count, error } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("Error checking categories:", error);
    throw error;
  }

  // If categories already exist, don't initialize
  if (count && count > 0) return;

  // Initialize all Signale categories
  for (const name of signalSubCategories) {
    await createCategory({
      name,
      parent_category: 'Signale',
      description: `Fragen zu ${name}`,
    });
  }

  // Initialize all Betriebsdienst categories
  for (const name of betriebsdienstSubCategories) {
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
