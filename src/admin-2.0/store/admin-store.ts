
import { create } from 'zustand';
import { AdminState, AdminCommand, Question, Category } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchQuestions, createQuestion, AdminService } from '@/api/questions';
import { fetchCategories } from '@/api/categories';

interface AdminStore extends AdminState {
  // Actions
  loadQuestions: () => Promise<void>;
  loadCategories: () => Promise<void>;
  execute: (command: AdminCommand) => Promise<void>;
  selectEntity: (id: string, type: 'question' | 'category') => void;
  setSearch: (query: string) => void;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  // State
  questions: {},
  categories: {},
  selectedEntity: null,
  selectedEntityType: null,
  searchQuery: '',
  isLoading: false,
  commandInProgress: false,
  lastError: null,

  // Actions
  loadQuestions: async () => {
    set({ isLoading: true });
    try {
      const questions = await fetchQuestions();
      const questionsMap = questions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {});
      set({ questions: questionsMap, isLoading: false });
    } catch (error) {
      console.error('Error loading questions:', error);
      set({ lastError: 'Fehler beim Laden der Fragen', isLoading: false });
    }
  },

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const categories = await fetchCategories();
      const categoriesMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
      set({ categories: categoriesMap, isLoading: false });
    } catch (error) {
      console.error('Error loading categories:', error);
      set({ lastError: 'Fehler beim Laden der Kategorien', isLoading: false });
    }
  },

  execute: async (command: AdminCommand) => {
    set({ commandInProgress: true, lastError: null });
    
    try {
      switch (command.type) {
        case 'QUESTION_CREATE':
          const newQuestion = await createQuestion(command.payload);
          set(state => ({
            questions: { ...state.questions, [newQuestion.id]: newQuestion },
            commandInProgress: false
          }));
          command.meta?.onSuccess?.(newQuestion);
          break;

        case 'QUESTION_UPDATE':
          // Use existing API service for updates
          const updatedQuestion = await AdminService.questions.update(command.payload.id, command.payload.data);
          set(state => ({
            questions: { ...state.questions, [updatedQuestion.id]: updatedQuestion },
            commandInProgress: false
          }));
          command.meta?.onSuccess?.(updatedQuestion);
          break;

        case 'QUESTION_DELETE':
          await AdminService.questions.delete(command.payload.id);
          set(state => {
            const { [command.payload.id]: deleted, ...rest } = state.questions;
            return { questions: rest, commandInProgress: false };
          });
          command.meta?.onSuccess?.();
          break;

        case 'QUESTION_DUPLICATE':
          const duplicated = await AdminService.questions.duplicate(command.payload.id);
          set(state => ({
            questions: { ...state.questions, [duplicated.id]: duplicated },
            commandInProgress: false
          }));
          command.meta?.onSuccess?.(duplicated);
          break;

        default:
          throw new Error(`Unknown command type: ${command.type}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      set({ lastError: errorMessage, commandInProgress: false });
      command.meta?.onError?.(error as Error);
    }
  },

  selectEntity: (id: string, type: 'question' | 'category') => {
    set({ selectedEntity: id, selectedEntityType: type });
  },

  setSearch: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ lastError: null });
  }
}));

// Custom hooks for React Query integration
export const useAdminQuestions = () => {
  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['admin-questions'],
    queryFn: fetchQuestions,
  });

  return {
    questions: questions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {}),
    isLoading,
    error
  };
};

export const useAdminCategories = () => {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories,
  });

  return {
    categories: categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}),
    isLoading,
    error
  };
};
