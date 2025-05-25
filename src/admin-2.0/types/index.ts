
// Core types for Admin Panel 2.0 - Now using unified types from main app

import { StructuredContent } from '@/types/rich-text';
import { Question, QuestionType, QuestionCategory, Answer } from '@/types/questions';
import { Category } from '@/api/categories/types';

// Re-export main app types for consistency
export type { QuestionType, QuestionCategory, Question, Answer, Category, StructuredContent };

// Command System Types
export interface AdminCommand {
  type: string;
  payload: any;
  meta?: {
    onSuccess?: (result?: any) => void;
    onError?: (error: Error) => void;
    optimistic?: boolean;
  };
}

export interface AdminState {
  questions: Record<string, Question>;
  categories: Record<string, Category>;
  selectedEntity: string | null;
  selectedEntityType: 'question' | 'category' | null;
  searchQuery: string;
  isLoading: boolean;
  commandInProgress: boolean;
  lastError: string | null;
}

// UI Component Types
export interface TableAction {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick: (id: string) => void;
  variant?: 'default' | 'destructive';
}

export interface QuestionTableProps {
  questions: Question[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  loading?: boolean;
}
