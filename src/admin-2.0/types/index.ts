
// Admin Panel 2.0 - Core Types

// Import base types from existing questions module
import { QuestionCategory, QuestionType, RegulationCategory } from '@/types/questions';
import { StructuredContent } from '@/types/rich-text';

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

export interface Answer {
  text: string | StructuredContent;
  isCorrect: boolean;
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

// Category type aligned with database schema
export interface Category extends AdminEntity {
  name: string;
  parent_category: string;
  description?: string;
  icon?: string;
  color?: string;
  // Database fields mapped to our interface
  sort_order: number;
  is_active: boolean;
  requires_auth: boolean;
  // Additional database fields
  isPro?: boolean;
  isPlanned?: boolean;
  content_type?: string;
  path?: string;
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

// Re-export types for convenience
export type { QuestionCategory, QuestionType, RegulationCategory, StructuredContent };
