
import { LearningSessionParams } from '@/types/navigation';

export class URLBuilder {
  static buildLearningPath(params: LearningSessionParams): string {
    const searchParams = new URLSearchParams();
    
    if (params.category) searchParams.set('category', params.category);
    if (params.subcategory) searchParams.set('subcategory', params.subcategory);
    if (params.regulation && params.regulation !== 'all') searchParams.set('regulation', params.regulation);
    if (params.mode && params.mode !== 'review') searchParams.set('mode', params.mode);
    if (params.box) searchParams.set('box', params.box.toString());
    
    const queryString = searchParams.toString();
    return `/karteikarten/lernen${queryString ? `?${queryString}` : ''}`;
  }

  static buildCategoryPath(category: string, subcategory?: string): string {
    const basePath = `/karteikarten/${category.toLowerCase()}`;
    return subcategory ? `${basePath}/${subcategory.toLowerCase().replace(/\s+/g, '-')}` : basePath;
  }

  static parseLearningURL(url: string): LearningSessionParams {
    const urlObj = new URL(url, window.location.origin);
    const params = new URLSearchParams(urlObj.search);
    
    return {
      category: params.get('category') || undefined,
      subcategory: params.get('subcategory') || undefined,
      regulation: params.get('regulation') as any || 'all',
      mode: params.get('mode') as any || 'review',
      box: params.get('box') ? parseInt(params.get('box')!) : undefined,
    };
  }

  static buildFullLearningURL(category: string, subcategory?: string, regulation?: string): string {
    return this.buildLearningPath({
      category,
      subcategory,
      regulation: regulation as any || 'all'
    });
  }
}
