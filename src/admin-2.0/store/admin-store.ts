
import { create } from 'zustand';
import { AdminState, AdminCommand, Question, Category } from '../types';

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
      // Mock data for now - in real app this would fetch from Supabase
      const mockQuestions: Question[] = [
        {
          id: '1',
          text: 'Was bedeutet das Hauptsignal Hp 1?',
          category: 'Signale',
          sub_category: 'Haupt- und Vorsignale',
          question_type: 'open',
          difficulty: 2,
          answers: [{ text: 'Fahrt', is_correct: true }],
          created_by: 'admin',
          revision: 1
        },
        {
          id: '2',
          text: 'Welche Geschwindigkeit gilt bei Langsamfahrstellen?',
          category: 'Betriebsdienst',
          sub_category: 'Grundlagen Bahnbetrieb',
          question_type: 'MC_single',
          difficulty: 3,
          answers: [
            { text: '40 km/h', is_correct: false },
            { text: '50 km/h', is_correct: true },
            { text: '60 km/h', is_correct: false }
          ],
          created_by: 'admin',
          revision: 1
        }
      ];

      const questionsMap = mockQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {});
      set({ questions: questionsMap, isLoading: false });
    } catch (error) {
      console.error('Error loading questions:', error);
      set({ lastError: 'Fehler beim Laden der Fragen', isLoading: false });
    }
  },

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      // Mock data for now
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Haupt- und Vorsignale',
          description: 'Grundlegende Signale für den Zugverkehr',
          parent_category: 'Signale',
          isPro: false,
          isPlanned: false
        },
        {
          id: '2',
          name: 'Grundlagen Bahnbetrieb',
          description: 'Fundamentale Regeln des Bahnbetriebs',
          parent_category: 'Betriebsdienst',
          isPro: false,
          isPlanned: false
        }
      ];

      const categoriesMap = mockCategories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
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
          // Mock question creation
          const newQuestion: Question = {
            id: Date.now().toString(),
            ...command.payload
          };
          set(state => ({
            questions: { ...state.questions, [newQuestion.id]: newQuestion },
            commandInProgress: false
          }));
          command.meta?.onSuccess?.(newQuestion);
          break;

        case 'QUESTION_DELETE':
          const { id } = command.payload;
          set(state => {
            const { [id]: deleted, ...rest } = state.questions;
            return { questions: rest, commandInProgress: false };
          });
          command.meta?.onSuccess?.();
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
