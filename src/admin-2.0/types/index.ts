
// Admin Panel 2.0 - Core Types
export interface AdminCommand<T = any> {
  type: string;
  payload?: T;
  meta?: {
    optimistic?: boolean;
    silent?: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  };
}

export interface AdminEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Question extends AdminEntity {
  category: QuestionCategory;
  sub_category: string;
  question_type: QuestionType;
  difficulty: number;
  text: string | StructuredContent;
  hint?: string | StructuredContent;
  image_url?: string;
  answers: Answer[];
  regulation_category?: RegulationCategory;
  created_by: string;
  revision: number;
}

export interface Category extends AdminEntity {
  name: string;
  parent_category?: QuestionCategory;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  requires_auth: boolean;
}

export interface AdminState {
  // Entity stores
  questions: Record<string, Question>;
  categories: Record<string, Category>;
  
  // UI state
  selectedEntity: string | null;
  selectedEntityType: 'question' | 'category' | null;
  isLoading: boolean;
  commandInProgress: boolean;
  
  // Search & filters
  searchQuery: string;
  activeFilters: Record<string, any>;
  
  // Command history
  commandHistory: AdminCommand[];
  undoStack: AdminCommand[];
  redoStack: AdminCommand[];
}

export interface AdminActions {
  // Command system
  execute: (command: AdminCommand) => Promise<void>;
  undo: () => void;
  redo: () => void;
  
  // Entity operations
  selectEntity: (id: string, type: 'question' | 'category') => void;
  clearSelection: () => void;
  
  // Search & filters
  setSearch: (query: string) => void;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  
  // Data operations
  loadQuestions: () => Promise<void>;
  loadCategories: () => Promise<void>;
  invalidateCache: () => void;
}

// Re-export existing types
export type { QuestionCategory, QuestionType, RegulationCategory, Answer, StructuredContent } from '@/types/questions';
