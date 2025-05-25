
// Core types for Admin Panel 2.0

import { StructuredContent } from '@/types/rich-text';

export type QuestionType = 'open' | 'MC_single' | 'MC_multi';
export type QuestionCategory = 'Signale' | 'Betriebsdienst';

export interface Answer {
  text: string | StructuredContent;
  is_correct: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  text: string | StructuredContent;
  category: QuestionCategory;
  sub_category: string;
  question_type: QuestionType;
  difficulty: number;
  answers: Answer[];
  image_url?: string;
  hint?: string | StructuredContent | null;
  created_by: string;
  revision: number;
  created_at?: string;
  updated_at?: string;
  regulation_category?: string;
  status?: string;
  content_version?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_category: string;
  icon?: string;
  color?: string;
  isPro: boolean;
  isPlanned: boolean;
  requiresAuth?: boolean;
  content_type?: string;
  path?: string;
  created_at?: string;
  updated_at?: string;
}

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
