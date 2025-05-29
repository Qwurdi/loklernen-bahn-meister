
// Navigation and routing types for unified URL structure
export interface NavigationPath {
  path: string;
  displayName: string;
  category: 'Signale' | 'Betriebsdienst';
  requiresAuth: boolean;
  isPro: boolean;
}

export interface LearningSessionParams {
  category?: string;
  subcategory?: string;
  regulation?: 'DS 301' | 'DV 301' | 'both' | 'all';
  mode?: 'review' | 'practice' | 'boxes';
  box?: number;
}

export interface URLBuilder {
  buildLearningPath: (params: LearningSessionParams) => string;
  buildCategoryPath: (category: string, subcategory?: string) => string;
  parseLearningURL: (url: string) => LearningSessionParams;
}
