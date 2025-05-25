
import { supabase } from '@/integrations/supabase/client';
import { Question, Category, Answer } from '../types';

// Transform database question to our Question type
const transformQuestion = (dbQuestion: any): Question => {
  return {
    ...dbQuestion,
    answers: Array.isArray(dbQuestion.answers) 
      ? dbQuestion.answers as Answer[]
      : typeof dbQuestion.answers === 'string' 
        ? JSON.parse(dbQuestion.answers) as Answer[]
        : [] as Answer[]
  };
};

// Transform database category to our Category type
const transformCategory = (dbCategory: any): Category => {
  return {
    id: dbCategory.id,
    created_at: dbCategory.created_at,
    updated_at: dbCategory.updated_at,
    name: dbCategory.name,
    parent_category: dbCategory.parent_category,
    description: dbCategory.description,
    icon: dbCategory.icon,
    color: dbCategory.color,
    // Map database fields to our interface
    sort_order: 0, // Default value since DB doesn't have this field
    is_active: true, // Default value
    requires_auth: dbCategory.requiresAuth || false,
    // Additional database fields
    isPro: dbCategory.isPro,
    isPlanned: dbCategory.isPlanned,
    content_type: dbCategory.content_type,
    path: dbCategory.path
  };
};

class AdminQuestionService {
  async getAll(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(transformQuestion);
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
    return transformQuestion(data);
  }

  async create(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();
    
    if (error) throw error;
    return transformQuestion(data);
  }

  async update(id: string, updates: Partial<Question>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformQuestion(data);
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
      .order('name', { ascending: true });
    
    if (error) throw error;
    return (data || []).map(transformCategory);
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
    return transformCategory(data);
  }

  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    // Map our interface back to database schema
    const dbCategory = {
      name: category.name,
      parent_category: category.parent_category,
      description: category.description,
      icon: category.icon,
      color: category.color,
      requiresAuth: category.requires_auth,
      isPro: category.isPro || false,
      isPlanned: category.isPlanned || false,
      content_type: category.content_type || 'plain',
      path: category.path
    };

    const { data, error } = await supabase
      .from('categories')
      .insert(dbCategory)
      .select()
      .single();
    
    if (error) throw error;
    return transformCategory(data);
  }

  async update(id: string, updates: Partial<Category>): Promise<Category> {
    // Map our interface back to database schema
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.parent_category !== undefined) dbUpdates.parent_category = updates.parent_category;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.requires_auth !== undefined) dbUpdates.requiresAuth = updates.requires_auth;
    if (updates.isPro !== undefined) dbUpdates.isPro = updates.isPro;
    if (updates.isPlanned !== undefined) dbUpdates.isPlanned = updates.isPlanned;
    if (updates.content_type !== undefined) dbUpdates.content_type = updates.content_type;
    if (updates.path !== undefined) dbUpdates.path = updates.path;

    const { data, error } = await supabase
      .from('categories')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return transformCategory(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async reorder(categoryIds: string[]): Promise<void> {
    // Since the database doesn't have sort_order, we'll skip this for now
    // This would need a database migration to add sort_order field
    console.log('Reorder not implemented - requires sort_order field in database');
  }
}

export const AdminService = {
  questions: new AdminQuestionService(),
  categories: new AdminCategoryService()
};
