
import { supabase } from '@/integrations/supabase/client';
import { Question, Category } from '../types';

class AdminQuestionService {
  async getAll(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Question | null> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async create(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Question>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async duplicate(id: string): Promise<Question> {
    const original = await this.getById(id);
    if (!original) throw new Error('Question not found');
    
    const { id: _, created_at, updated_at, ...duplicateData } = original;
    const duplicated = await this.create({
      ...duplicateData,
      text: `${duplicateData.text} (Kopie)`,
      revision: 1
    });
    
    return duplicated;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .in('id', ids);
    
    if (error) throw error;
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<Question> }>): Promise<Question[]> {
    const results: Question[] = [];
    
    for (const update of updates) {
      const result = await this.update(update.id, update.data);
      results.push(result);
    }
    
    return results;
  }
}

class AdminCategoryService {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async reorder(categoryIds: string[]): Promise<void> {
    const updates = categoryIds.map((id, index) => ({ id, sort_order: index }));
    
    for (const update of updates) {
      await this.update(update.id, { sort_order: update.sort_order });
    }
  }
}

export const AdminService = {
  questions: new AdminQuestionService(),
  categories: new AdminCategoryService()
};
