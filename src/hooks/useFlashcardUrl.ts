
import { signalSubCategories } from "@/api/categories/types";

/**
 * Helper to map URL subcategory param back to original subcategory string (case sensitive)
 */
export function mapUrlToSubcategory(urlSubcategory?: string): string | undefined {
  if (!urlSubcategory) return undefined;
  const normalizedParam = urlSubcategory.toLowerCase();

  const found = signalSubCategories.find((subcat) => 
    subcat.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedParam
  );
  return found;
}
