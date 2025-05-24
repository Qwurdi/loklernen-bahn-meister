
import { Category } from './types';
import { supabase } from '@/integrations/supabase/client';

export class CategoryPathResolver {
  private static cache = new Map<string, Category>();

  static async resolveByPath(path: string): Promise<Category | null> {
    // Check cache first
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('path', path)
        .single();

      if (error || !data) {
        console.warn(`Category not found for path: ${path}`);
        return null;
      }

      const category = data as Category;
      this.cache.set(path, category);
      return category;
    } catch (error) {
      console.error('Error resolving category by path:', error);
      return null;
    }
  }

  static async resolveByName(name: string): Promise<Category | null> {
    // Try to find by path first (name converted to path format)
    const pathFormat = name.toLowerCase().replace(/\s+/g, '-');
    let category = await this.resolveByPath(pathFormat);
    
    if (category) return category;

    // Fallback to name lookup
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', name)
        .single();

      if (error || !data) {
        return null;
      }

      category = data as Category;
      
      // Cache by path if it exists
      if (category.path) {
        this.cache.set(category.path, category);
      }
      
      return category;
    } catch (error) {
      console.error('Error resolving category by name:', error);
      return null;
    }
  }

  static buildPath(category: string, subcategory?: string): string {
    const basePath = category.toLowerCase().replace(/\s+/g, '-');
    if (!subcategory) return basePath;
    
    const subPath = subcategory.toLowerCase().replace(/\s+/g, '-');
    return `${basePath}/${subPath}`;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
