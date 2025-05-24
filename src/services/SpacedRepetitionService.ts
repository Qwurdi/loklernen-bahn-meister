
import { supabase } from '@/integrations/supabase/client';
import { transformQuestion } from '@/api/questions/transformers';
import { Question } from '@/types/questions';
import { SessionOptions, SessionQuestion, UserProgress } from '@/types/spaced-repetition';

class SpacedRepetitionService {
  /**
   * Load questions for a learning session
   */
  async loadSessionQuestions(userId: string | null, options: SessionOptions): Promise<SessionQuestion[]> {
    try {
      if (!userId) {
        // Guest user - load questions without progress
        return await this.loadGuestQuestions(options);
      }

      // Authenticated user - load questions with progress
      return await this.loadAuthenticatedQuestions(userId, options);
    } catch (error) {
      console.error('Error loading session questions:', error);
      throw new Error('Fehler beim Laden der Fragen');
    }
  }

  /**
   * Submit an answer and update progress
   */
  async submitAnswer(userId: string | null, questionId: string, score: number): Promise<void> {
    if (!userId) {
      // Guest users don't save progress
      return;
    }

    try {
      await this.updateUserProgress(userId, questionId, score);
      await this.updateUserStats(userId, score);
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw new Error('Fehler beim Speichern der Antwort');
    }
  }

  /**
   * Load questions for guest users (no progress tracking)
   */
  private async loadGuestQuestions(options: SessionOptions): Promise<SessionQuestion[]> {
    let query = supabase
      .from('questions')
      .select('*')
      .limit(options.batchSize || 20);

    // Apply filters
    if (options.category) {
      query = query.eq('category', options.category);
    }

    if (options.subcategory) {
      query = query.eq('sub_category', options.subcategory);
    }

    if (options.regulation && options.regulation !== 'all') {
      query = query.or(`regulation_category.eq.${options.regulation},regulation_category.eq.both,regulation_category.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform questions and wrap in SessionQuestion format
    return (data || []).map(dbQuestion => ({
      question: transformQuestion(dbQuestion),
      progress: undefined
    }));
  }

  /**
   * Load questions for authenticated users with progress
   */
  private async loadAuthenticatedQuestions(userId: string, options: SessionOptions): Promise<SessionQuestion[]> {
    if (options.mode === 'boxes' && options.boxNumber) {
      return await this.loadBoxQuestions(userId, options.boxNumber, options.regulation);
    }

    if (options.mode === 'practice') {
      return await this.loadPracticeQuestions(userId, options);
    }

    // Default: load due questions for review
    return await this.loadDueQuestions(userId, options);
  }

  /**
   * Load questions from a specific box
   */
  private async loadBoxQuestions(userId: string, boxNumber: number, regulation: string = 'all'): Promise<SessionQuestion[]> {
    const { data, error } = await supabase
      .rpc('get_latest_progress_by_box', {
        p_user_id: userId,
        p_box_number: boxNumber
      });

    if (error) {
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Filter by regulation if needed
    let filteredData = data;
    if (regulation !== 'all') {
      filteredData = data.filter(item => {
        const questionData = item.questions as any;
        return questionData?.regulation_category === regulation || 
               questionData?.regulation_category === 'both' || 
               !questionData?.regulation_category;
      });
    }

    // Transform to SessionQuestion format
    return filteredData.map(item => {
      const questionData = item.questions as any;
      const progress: UserProgress = {
        id: item.id,
        user_id: item.user_id,
        question_id: item.question_id,
        last_score: item.last_score,
        box_number: item.box_number,
        last_reviewed_at: item.last_reviewed_at,
        next_review_at: item.next_review_at,
        ease_factor: item.ease_factor,
        interval_days: item.interval_days,
        repetition_count: item.repetition_count,
        correct_count: item.correct_count,
        incorrect_count: item.incorrect_count,
        streak: item.streak,
        created_at: item.created_at,
        updated_at: item.updated_at
      };

      return {
        question: transformQuestion(questionData),
        progress
      };
    });
  }

  /**
   * Load questions for practice mode
   */
  private async loadPracticeQuestions(userId: string, options: SessionOptions): Promise<SessionQuestion[]> {
    let query = supabase
      .from('questions')
      .select('*')
      .limit(options.batchSize || 20);

    // Apply filters
    if (options.category) {
      query = query.eq('category', options.category);
    }

    if (options.subcategory) {
      query = query.eq('sub_category', options.subcategory);
    }

    if (options.regulation && options.regulation !== 'all') {
      query = query.or(`regulation_category.eq.${options.regulation},regulation_category.eq.both,regulation_category.is.null`);
    }

    const { data: questions, error } = await query;

    if (error) {
      throw error;
    }

    if (!questions) {
      return [];
    }

    // Get progress for these questions
    const questionIds = questions.map(q => q.id);
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .in('question_id', questionIds);

    // Create progress map
    const progressMap = new Map<string, UserProgress>();
    if (progressData) {
      progressData.forEach(p => {
        progressMap.set(p.question_id, p as UserProgress);
      });
    }

    // Transform to SessionQuestion format
    return questions.map(dbQuestion => ({
      question: transformQuestion(dbQuestion),
      progress: progressMap.get(dbQuestion.id)
    }));
  }

  /**
   * Load due questions for review
   */
  private async loadDueQuestions(userId: string, options: SessionOptions): Promise<SessionQuestion[]> {
    const now = new Date().toISOString();
    
    let query = supabase
      .from('user_progress')
      .select(`
        *,
        questions (*)
      `)
      .eq('user_id', userId)
      .lte('next_review_at', now)
      .order('next_review_at', { ascending: true })
      .limit(options.batchSize || 20);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Filter by category/subcategory/regulation
    let filteredData = data;
    
    if (options.category || options.subcategory || (options.regulation && options.regulation !== 'all')) {
      filteredData = data.filter(item => {
        const question = item.questions as any;
        if (!question) return false;

        if (options.category && question.category !== options.category) {
          return false;
        }

        if (options.subcategory && question.sub_category !== options.subcategory) {
          return false;
        }

        if (options.regulation && options.regulation !== 'all') {
          const questionRegulation = question.regulation_category;
          if (questionRegulation && questionRegulation !== options.regulation && questionRegulation !== 'both') {
            return false;
          }
        }

        return true;
      });
    }

    // Transform to SessionQuestion format
    return filteredData.map(item => ({
      question: transformQuestion(item.questions as any),
      progress: item as UserProgress
    }));
  }

  /**
   * Update user progress for a question
   */
  private async updateUserProgress(userId: string, questionId: string, score: number): Promise<void> {
    // Get existing progress
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date().toISOString();

    if (existingProgress) {
      // Update existing progress
      const newBoxNumber = this.calculateNewBoxNumber(existingProgress.box_number, score);
      const nextReview = this.calculateNextReviewDate(newBoxNumber);

      const updates = {
        last_score: score,
        box_number: newBoxNumber,
        next_review_at: nextReview,
        last_reviewed_at: now,
        streak: score >= 4 ? existingProgress.streak + 1 : 0,
        repetition_count: existingProgress.repetition_count + 1,
        correct_count: score >= 4 ? existingProgress.correct_count + 1 : existingProgress.correct_count,
        incorrect_count: score >= 4 ? existingProgress.incorrect_count : existingProgress.incorrect_count + 1,
        updated_at: now
      };

      await supabase
        .from('user_progress')
        .update(updates)
        .eq('id', existingProgress.id);
    } else {
      // Create new progress entry
      const newBoxNumber = score >= 4 ? 2 : 1;
      
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          question_id: questionId,
          last_score: score,
          box_number: newBoxNumber,
          last_reviewed_at: now,
          next_review_at: this.calculateNextReviewDate(newBoxNumber),
          streak: score >= 4 ? 1 : 0,
          correct_count: score >= 4 ? 1 : 0,
          incorrect_count: score >= 4 ? 0 : 1
        });
    }
  }

  /**
   * Update user stats
   */
  private async updateUserStats(userId: string, score: number): Promise<void> {
    const currentDate = new Date().toISOString().split('T')[0];
    const xpGain = this.calculateXpGain(score);

    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingStats) {
      const updates: any = {
        last_activity_date: currentDate,
        updated_at: new Date().toISOString(),
        xp: existingStats.xp + xpGain
      };

      if (score >= 4) {
        updates.total_correct = existingStats.total_correct + 1;
      } else {
        updates.total_incorrect = existingStats.total_incorrect + 1;
      }

      // Update streak
      const lastActivityDate = new Date(existingStats.last_activity_date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActivityDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0] ||
          lastActivityDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
        if (lastActivityDate.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
          updates.streak_days = existingStats.streak_days + 1;
        }
      } else {
        updates.streak_days = 1;
      }

      await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          total_correct: score >= 4 ? 1 : 0,
          total_incorrect: score >= 4 ? 0 : 1,
          last_activity_date: currentDate,
          streak_days: 1,
          xp: xpGain
        });
    }
  }

  /**
   * Calculate new box number based on score
   */
  private calculateNewBoxNumber(currentBox: number, score: number): number {
    if (score <= 2) {
      return 1; // Failed recall, reset to box 1
    } else if (score === 3) {
      return Math.min(currentBox + 1, 5); // Difficult recall, move forward cautiously
    } else {
      return Math.min(currentBox + 1, 5); // Good recall, move forward
    }
  }

  /**
   * Calculate next review date based on box number
   */
  private calculateNextReviewDate(boxNumber: number): string {
    const now = new Date();
    
    switch (boxNumber) {
      case 1: now.setDate(now.getDate() + 1); break;
      case 2: now.setDate(now.getDate() + 3); break;
      case 3: now.setDate(now.getDate() + 7); break;
      case 4: now.setDate(now.getDate() + 14); break;
      case 5: now.setDate(now.getDate() + 30); break;
      default: now.setDate(now.getDate() + 1);
    }
    
    return now.toISOString();
  }

  /**
   * Calculate XP gain based on score
   */
  private calculateXpGain(score: number): number {
    const baseXP = 10;
    
    switch (score) {
      case 0:
      case 1: return 5;
      case 2: return 8;
      case 3: return baseXP;
      case 4: return Math.round(baseXP * 1.2);
      case 5: return Math.round(baseXP * 1.5);
      default: return baseXP;
    }
  }
}

// Export singleton instance
export const spacedRepetitionService = new SpacedRepetitionService();
