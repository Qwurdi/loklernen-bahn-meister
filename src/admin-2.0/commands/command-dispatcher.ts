
import { AdminCommand, AdminState, AdminActions } from '../types';
import { AdminService } from '../services/admin-service';
import { useNotification } from '@/hooks/useNotification';

export class CommandDispatcher {
  private get: () => AdminState & AdminActions;
  private set: (state: Partial<AdminState>) => void;
  private notifications = useNotification();

  constructor(
    get: () => AdminState & AdminActions,
    set: (state: Partial<AdminState>) => void
  ) {
    this.get = get;
    this.set = set;
  }

  async execute(command: AdminCommand): Promise<void> {
    const { type, payload, meta } = command;
    
    // Set command in progress
    this.set({ commandInProgress: true });
    
    try {
      // Add to command history
      this.set(state => ({
        commandHistory: [...state.commandHistory, command],
        redoStack: [] // Clear redo stack when new command is executed
      }));

      // Execute command based on type
      switch (type) {
        case 'QUESTION_CREATE':
          await this.handleQuestionCreate(payload);
          break;
        case 'QUESTION_UPDATE':
          await this.handleQuestionUpdate(payload);
          break;
        case 'QUESTION_DELETE':
          await this.handleQuestionDelete(payload);
          break;
        case 'QUESTION_DUPLICATE':
          await this.handleQuestionDuplicate(payload);
          break;
        case 'QUESTIONS_BULK_DELETE':
          await this.handleQuestionsBulkDelete(payload);
          break;
        case 'CATEGORY_CREATE':
          await this.handleCategoryCreate(payload);
          break;
        case 'CATEGORY_UPDATE':
          await this.handleCategoryUpdate(payload);
          break;
        case 'CATEGORY_DELETE':
          await this.handleCategoryDelete(payload);
          break;
        case 'CATEGORIES_REORDER':
          await this.handleCategoriesReorder(payload);
          break;
        default:
          throw new Error(`Unknown command type: ${type}`);
      }

      // Add to undo stack if command is undoable
      if (this.isUndoableCommand(type)) {
        this.set(state => ({
          undoStack: [...state.undoStack, command]
        }));
      }

      // Show success notification if not silent
      if (!meta?.silent) {
        this.notifications.success(this.getSuccessMessage(type));
      }

      // Execute success callback
      meta?.onSuccess?.();

    } catch (error) {
      console.error('Command execution failed:', error);
      
      // Show error notification
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      this.notifications.error(`Fehler: ${errorMessage}`);
      
      // Execute error callback
      meta?.onError?.(error as Error);
      
      // Remove failed command from history
      this.set(state => ({
        commandHistory: state.commandHistory.slice(0, -1)
      }));
      
      throw error;
    } finally {
      this.set({ commandInProgress: false });
    }
  }

  async undo(command: AdminCommand): Promise<void> {
    // Implement undo logic based on command type
    console.log('Undo command:', command.type);
    // This would be implemented with reverse operations
  }

  private async handleQuestionCreate(payload: any) {
    const question = await AdminService.questions.create(payload);
    this.set(state => ({
      questions: { ...state.questions, [question.id]: question }
    }));
  }

  private async handleQuestionUpdate(payload: { id: string; data: any }) {
    const question = await AdminService.questions.update(payload.id, payload.data);
    this.set(state => ({
      questions: { ...state.questions, [question.id]: question }
    }));
  }

  private async handleQuestionDelete(payload: { id: string }) {
    await AdminService.questions.delete(payload.id);
    this.set(state => {
      const { [payload.id]: deleted, ...rest } = state.questions;
      return { questions: rest };
    });
  }

  private async handleQuestionDuplicate(payload: { id: string }) {
    const question = await AdminService.questions.duplicate(payload.id);
    this.set(state => ({
      questions: { ...state.questions, [question.id]: question }
    }));
  }

  private async handleQuestionsBulkDelete(payload: { ids: string[] }) {
    await AdminService.questions.bulkDelete(payload.ids);
    this.set(state => {
      const newQuestions = { ...state.questions };
      payload.ids.forEach(id => delete newQuestions[id]);
      return { questions: newQuestions };
    });
  }

  private async handleCategoryCreate(payload: any) {
    const category = await AdminService.categories.create(payload);
    this.set(state => ({
      categories: { ...state.categories, [category.id]: category }
    }));
  }

  private async handleCategoryUpdate(payload: { id: string; data: any }) {
    const category = await AdminService.categories.update(payload.id, payload.data);
    this.set(state => ({
      categories: { ...state.categories, [category.id]: category }
    }));
  }

  private async handleCategoryDelete(payload: { id: string }) {
    await AdminService.categories.delete(payload.id);
    this.set(state => {
      const { [payload.id]: deleted, ...rest } = state.categories;
      return { categories: rest };
    });
  }

  private async handleCategoriesReorder(payload: { categoryIds: string[] }) {
    await AdminService.categories.reorder(payload.categoryIds);
    // Reload categories to get updated sort order
    const categories = await AdminService.categories.getAll();
    const categoriesMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    this.set({ categories: categoriesMap });
  }

  private isUndoableCommand(type: string): boolean {
    const undoableCommands = [
      'QUESTION_CREATE',
      'QUESTION_UPDATE', 
      'QUESTION_DELETE',
      'CATEGORY_CREATE',
      'CATEGORY_UPDATE',
      'CATEGORY_DELETE'
    ];
    return undoableCommands.includes(type);
  }

  private getSuccessMessage(type: string): string {
    const messages: Record<string, string> = {
      'QUESTION_CREATE': 'Frage erstellt',
      'QUESTION_UPDATE': 'Frage aktualisiert',
      'QUESTION_DELETE': 'Frage gelöscht',
      'QUESTION_DUPLICATE': 'Frage dupliziert',
      'QUESTIONS_BULK_DELETE': 'Fragen gelöscht',
      'CATEGORY_CREATE': 'Kategorie erstellt',
      'CATEGORY_UPDATE': 'Kategorie aktualisiert',
      'CATEGORY_DELETE': 'Kategorie gelöscht',
      'CATEGORIES_REORDER': 'Kategorien neu sortiert'
    };
    return messages[type] || 'Aktion ausgeführt';
  }
}
