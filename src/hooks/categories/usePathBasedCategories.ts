
import { useState, useEffect } from 'react';
import { CategoryPathResolver } from '@/api/categories/path-resolver';
import { Category } from '@/api/categories/types';

export function usePathBasedCategories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resolveCategory = async (path: string): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const category = await CategoryPathResolver.resolveByPath(path);
      return category;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error resolving category');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resolveCategoryByName = async (name: string): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const category = await CategoryPathResolver.resolveByName(name);
      return category;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error resolving category');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryPath = (category: string, subcategory?: string): string => {
    return CategoryPathResolver.buildPath(category, subcategory);
  };

  return {
    loading,
    error,
    resolveCategory,
    resolveCategoryByName,
    buildCategoryPath
  };
}
