
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { AdminState, AdminActions, AdminCommand } from '../types';
import { AdminService } from '../services/admin-service';
import { CommandDispatcher } from '../commands/command-dispatcher';

interface AdminStore extends AdminState, AdminActions {}

export const useAdminStore = create<AdminStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      questions: {},
      categories: {},
      selectedEntity: null,
      selectedEntityType: null,
      isLoading: false,
      commandInProgress: false,
      searchQuery: '',
      activeFilters: {},
      commandHistory: [],
      undoStack: [],
      redoStack: [],

      // Command system
      execute: async (command: AdminCommand) => {
        const dispatcher = new CommandDispatcher(get, set);
        await dispatcher.execute(command);
      },

      undo: () => {
        const { undoStack, redoStack } = get();
        if (undoStack.length === 0) return;
        
        const lastCommand = undoStack[undoStack.length - 1];
        const dispatcher = new CommandDispatcher(get, set);
        
        set(state => ({
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, lastCommand]
        }));
        
        dispatcher.undo(lastCommand);
      },

      redo: () => {
        const { redoStack, undoStack } = get();
        if (redoStack.length === 0) return;
        
        const command = redoStack[redoStack.length - 1];
        const dispatcher = new CommandDispatcher(get, set);
        
        set(state => ({
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, command]
        }));
        
        dispatcher.execute(command);
      },

      // Entity operations
      selectEntity: (id: string, type: 'question' | 'category') => {
        set({ selectedEntity: id, selectedEntityType: type });
      },

      clearSelection: () => {
        set({ selectedEntity: null, selectedEntityType: null });
      },

      // Search & filters
      setSearch: (query: string) => {
        set({ searchQuery: query });
      },

      setFilter: (key: string, value: any) => {
        set(state => ({
          activeFilters: { ...state.activeFilters, [key]: value }
        }));
      },

      clearFilters: () => {
        set({ activeFilters: {} });
      },

      // Data operations
      loadQuestions: async () => {
        set({ isLoading: true });
        try {
          const questions = await AdminService.questions.getAll();
          const questionsMap = questions.reduce((acc, q) => ({ ...acc, [q.id]: q }), {});
          set({ questions: questionsMap });
        } finally {
          set({ isLoading: false });
        }
      },

      loadCategories: async () => {
        set({ isLoading: true });
        try {
          const categories = await AdminService.categories.getAll();
          const categoriesMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
          set({ categories: categoriesMap });
        } finally {
          set({ isLoading: false });
        }
      },

      invalidateCache: () => {
        set({ questions: {}, categories: {} });
      }
    })),
    {
      name: 'admin-store-2.0'
    }
  )
);
