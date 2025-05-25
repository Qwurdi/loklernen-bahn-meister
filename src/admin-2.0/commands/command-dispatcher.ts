
import { AdminCommand, AdminState, Question, Category } from '../types';
import { AdminService } from '../services/admin-service';

export class CommandDispatcher {
  constructor(
    private getState: () => AdminState & any,
    private setState: (updater: (state: any) => any) => void
  ) {}

  async execute(command: AdminCommand): Promise<void> {
    this.setState(state => ({ ...state, commandInProgress: true }));
    
    try {
      switch (command.type) {
        case 'QUESTION_CREATE':
          await this.createQuestion(command.payload);
          break;
        case 'QUESTION_UPDATE':
          await this.updateQuestion(command.payload);
          break;
        case 'QUESTION_DELETE':
          await this.deleteQuestion(command.payload);
          break;
        case 'CATEGORY_CREATE':
          await this.createCategory(command.payload);
          break;
        case 'CATEGORY_UPDATE':
          await this.updateCategory(command.payload);
          break;
        case 'CATEGORY_DELETE':
          await this.deleteCategory(command.payload);
          break;
        default:
          console.warn('Unknown command type:', command.type);
      }
      
      // Add to command history
      this.setState(state => ({
        ...state,
        commandHistory: [...state.commandHistory, command],
        undoStack: [...state.undoStack, command],
        redoStack: []
      }));
      
      command.meta?.onSuccess?.();
    } catch (error) {
      console.error('Command execution failed:', error);
      command.meta?.onError?.(error as Error);
    } finally {
      this.setState(state => ({ ...state, commandInProgress: false }));
    }
  }

  async undo(command: AdminCommand): Promise<void> {
    // Implement undo logic based on command type
    console.log('Undo command:', command.type);
  }

  private async createQuestion(payload: any): Promise<void> {
    const question = await AdminService.questions.create(payload);
    this.setState(state => ({
      ...state,
      questions: { ...state.questions, [question.id]: question }
    }));
  }

  private async updateQuestion(payload: { id: string; data: Partial<Question> }): Promise<void> {
    const question = await AdminService.questions.update(payload.id, payload.data);
    this.setState(state => ({
      ...state,
      questions: { ...state.questions, [question.id]: question }
    }));
  }

  private async deleteQuestion(payload: { id: string }): Promise<void> {
    await AdminService.questions.delete(payload.id);
    this.setState(state => {
      const { [payload.id]: deleted, ...rest } = state.questions;
      return { ...state, questions: rest };
    });
  }

  private async createCategory(payload: any): Promise<void> {
    const category = await AdminService.categories.create(payload);
    this.setState(state => ({
      ...state,
      categories: { ...state.categories, [category.id]: category }
    }));
  }

  private async updateCategory(payload: { id: string; data: Partial<Category> }): Promise<void> {
    const category = await AdminService.categories.update(payload.id, payload.data);
    this.setState(state => ({
      ...state,
      categories: { ...state.categories, [category.id]: category }
    }));
  }

  private async deleteCategory(payload: { id: string }): Promise<void> {
    await AdminService.categories.delete(payload.id);
    this.setState(state => {
      const { [payload.id]: deleted, ...rest } = state.categories;
      return { ...state, categories: rest };
    });
  }
}
