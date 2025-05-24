
// Navigation and routing types for unified URL structure
export interface NavigationPath {
  path: string;
  displayName: string;
  category: 'Signale' | 'Betriebsdienst';
  requiresAuth: boolean;
  isPro: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_category: string;
  path?: string;
  requiresAuth?: boolean;
  isPro?: boolean;
  isPlanned?: boolean;
  icon?: string;
  color?: string;
  content_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryMetadata {
  isPro: boolean;
  isPlanned: boolean;
  requiresAuth?: boolean;
}
