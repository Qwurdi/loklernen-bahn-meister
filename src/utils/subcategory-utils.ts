
import { signalSubCategories, betriebsdienstSubCategories } from "@/api/categories/types";
import { QuestionCategory } from "@/types/questions";

// Helper to map URL subcategory param back to original subcategory string (case sensitive)
export function mapUrlToSubcategory(urlSubcategory?: string): string | undefined {
  if (!urlSubcategory) return undefined;
  const normalizedParam = urlSubcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Include both Signal and Betriebsdienst subcategories in our search
  const knownSubcategories = [...signalSubCategories, ...betriebsdienstSubCategories];
  const found = knownSubcategories.find((subcat) => 
    subcat.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedParam
  );
  return found || urlSubcategory; // Fallback to original if not found, assuming it might be correct
}

// Helper to determine if a subcategory belongs to Betriebsdienst
export function isBetriebsdienstCategory(subcategory?: string): boolean {
  if (!subcategory) return false;
  return betriebsdienstSubCategories.some(
    cat => cat.toLowerCase() === subcategory.toLowerCase()
  );
}

// Helper to determine main category from various inputs
export function determineMainCategory(
  urlSubcategoryParam?: string | null,
  categoryUrlQueryParam?: string | null,
  categoriesUrlQueryParam?: string[],
  parentCategoryParam?: string | null
): QuestionCategory {
  // If parent_category parameter is explicitly set, use that
  if (parentCategoryParam) {
    if (parentCategoryParam.toLowerCase() === 'betriebsdienst') {
      return 'Betriebsdienst';
    } else if (parentCategoryParam.toLowerCase() === 'signale') {
      return 'Signale';
    }
  }

  // Check subcategory
  if (urlSubcategoryParam) {
    const mappedSubcategory = mapUrlToSubcategory(urlSubcategoryParam);
    
    if (mappedSubcategory && isBetriebsdienstCategory(mappedSubcategory)) {
      return 'Betriebsdienst';
    }
    
    // Check path segments as a fallback
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.includes('betriebsdienst')) {
      return 'Betriebsdienst';
    } else if (pathSegments.includes('signale')) {
      return 'Signale';
    }
  }

  // Check category parameter
  if (categoryUrlQueryParam) {
    if (categoryUrlQueryParam.toLowerCase() === 'betriebsdienst') {
      return 'Betriebsdienst';
    } else if (categoryUrlQueryParam.toLowerCase() === 'signale') {
      return 'Signale';
    }
    
    const potentialSubCategory = mapUrlToSubcategory(categoryUrlQueryParam);
    if (potentialSubCategory && isBetriebsdienstCategory(potentialSubCategory)) {
      return 'Betriebsdienst';
    }
  }

  // Check category arrays
  if (categoriesUrlQueryParam && categoriesUrlQueryParam.length > 0) {
    // Check if any of the categories are Betriebsdienst categories
    const hasBetriebsdienstCategory = categoriesUrlQueryParam.some(
      cat => betriebsdienstSubCategories.some(
        bcat => bcat.toLowerCase() === cat.toLowerCase()
      )
    );
    
    if (hasBetriebsdienstCategory) {
      return 'Betriebsdienst';
    }
  }

  // Default to Signale
  return 'Signale';
}
