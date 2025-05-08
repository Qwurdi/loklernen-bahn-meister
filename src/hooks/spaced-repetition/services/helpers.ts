
/**
 * Builds a category filter string for Supabase queries
 * 
 * @param categoryIdentifier Single category name or array of category names
 * @returns Filter string for OR conditions in Supabase query
 */
export function buildCategoryFilter(categoryIdentifier: string | string[]): string | null {
  if (!categoryIdentifier) {
    return null;
  }
  
  // If it's a single string, check if it's empty
  if (typeof categoryIdentifier === 'string') {
    if (!categoryIdentifier.trim()) return null;
    return `category.eq.${categoryIdentifier}`;
  }
  
  // If it's an array, filter out empty strings and build OR condition
  const validCategories = categoryIdentifier.filter(c => c && c.trim());
  if (validCategories.length === 0) return null;
  
  return validCategories.map(c => `category.eq.${c}`).join(',');
}
