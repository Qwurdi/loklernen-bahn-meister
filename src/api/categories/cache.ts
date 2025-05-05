
import { Category } from "./types";

// Cache for categories to avoid multiple fetches
let cachedCategories: Category[] | null = null;

// Get cached categories
export function getCachedCategories(): Category[] | null {
  return cachedCategories;
}

// Set cached categories
export function setCachedCategories(categories: Category[]): void {
  cachedCategories = categories;
}

// Clear the categories cache
export function clearCategoriesCache(): void {
  cachedCategories = null;
}
