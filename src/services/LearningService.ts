
import { supabase } from "@/integrations/supabase/client";
import { Question, QuestionCategory } from "@/types/questions";
import { RegulationFilterType } from "@/types/regulation";

export interface LearningSession {
  questions: Question[];
  sessionId: string;
  startTime: Date;
  currentIndex: number;
  correctCount: number;
  answers: Array<{
    questionId: string;
    score: number;
    timestamp: Date;
  }>;
}

export interface SessionOptions {
  category?: QuestionCategory;
  subcategory?: string;
  regulationFilter?: RegulationFilterType;
  batchSize?: number;
  practiceMode?: boolean;
  boxNumber?: number;
}

class LearningServiceClass {
  private currentSession: LearningSession | null = null;
  private pendingAnswers: Array<{ questionId: string; score: number }> = [];

  async startSession(userId: string | null, options: SessionOptions): Promise<LearningSession> {
    console.log('Starting learning session:', options);
    
    const sessionId = crypto.randomUUID();
    const batchSize = options.batchSize || 10;
    
    let questions: Question[] = [];

    if (options.practiceMode || !userId) {
      // Practice mode - fetch random questions
      questions = await this.fetchPracticeQuestions(options, batchSize);
    } else {
      // Authenticated mode - fetch due questions first, then new ones
      questions = await this.fetchSessionQuestions(userId, options, batchSize);
    }

    this.currentSession = {
      questions,
      sessionId,
      startTime: new Date(),
      currentIndex: 0,
      correctCount: 0,
      answers: []
    };

    return this.currentSession;
  }

  private async fetchPracticeQuestions(options: SessionOptions, batchSize: number): Promise<Question[]> {
    let query = supabase
      .from('questions')
      .select('*')
      .limit(batchSize);

    if (options.category) {
      query = query.eq('category', options.category);
    }

    if (options.subcategory) {
      query = query.eq('sub_category', options.subcategory);
    }

    if (options.regulationFilter && options.regulationFilter !== 'all') {
      query = query.or(`regulation_category.eq."${options.regulationFilter}",regulation_category.eq.both,regulation_category.is.null`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return this.transformQuestions(data || []);
  }

  private async fetchSessionQuestions(userId: string, options: SessionOptions, batchSize: number): Promise<Question[]> {
    const now = new Date().toISOString();
    
    // First, get due questions
    let progressQuery = supabase
      .from('user_progress')
      .select(`
        *,
        questions!inner(*)
      `)
      .eq('user_id', userId)
      .lte('next_review_at', now)
      .limit(batchSize);

    if (options.category) {
      progressQuery = progressQuery.eq('questions.category', options.category);
    }

    if (options.subcategory) {
      progressQuery = progressQuery.eq('questions.sub_category', options.subcategory);
    }

    if (options.regulationFilter && options.regulationFilter !== 'all') {
      progressQuery = progressQuery.or(`questions.regulation_category.eq."${options.regulationFilter}",questions.regulation_category.eq.both,questions.regulation_category.is.null`);
    }

    const { data: progressData, error: progressError } = await progressQuery;
    if (progressError) throw progressError;

    const dueQuestions = (progressData || []).map(p => this.transformQuestion(p.questions));
    
    if (dueQuestions.length >= batchSize) {
      return dueQuestions.slice(0, batchSize);
    }

    // Fill remaining slots with new questions
    const questionIdsWithProgress = (progressData || []).map(p => p.question_id);
    const remainingSlots = batchSize - dueQuestions.length;
    
    let newQuestionsQuery = supabase
      .from('questions')
      .select('*')
      .not('id', 'in', `(${questionIdsWithProgress.join(',')})`)
      .limit(remainingSlots);

    if (options.category) {
      newQuestionsQuery = newQuestionsQuery.eq('category', options.category);
    }

    if (options.subcategory) {
      newQuestionsQuery = newQuestionsQuery.eq('sub_category', options.subcategory);
    }

    if (options.regulationFilter && options.regulationFilter !== 'all') {
      newQuestionsQuery = newQuestionsQuery.or(`regulation_category.eq."${options.regulationFilter}",regulation_category.eq.both,regulation_category.is.null`);
    }

    const { data: newQuestionsData, error: newQuestionsError } = await newQuestionsQuery;
    if (newQuestionsError) throw newQuestionsError;

    const newQuestions = this.transformQuestions(newQuestionsData || []);
    return [...dueQuestions, ...newQuestions].slice(0, batchSize);
  }

  async submitAnswer(questionId: string, score: number): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const answer = {
      questionId,
      score,
      timestamp: new Date()
    };

    this.currentSession.answers.push(answer);
    
    if (score >= 4) {
      this.currentSession.correctCount++;
    }

    // Queue answer for later sync if user is authenticated
    this.pendingAnswers.push({ questionId, score });
  }

  async syncAnswers(userId: string): Promise<void> {
    if (this.pendingAnswers.length === 0) return;

    console.log(`Syncing ${this.pendingAnswers.length} answers for user ${userId}`);

    for (const answer of this.pendingAnswers) {
      try {
        await this.updateUserProgress(userId, answer.questionId, answer.score);
      } catch (error) {
        console.error('Failed to sync answer:', error);
      }
    }

    this.pendingAnswers = [];
  }

  private async updateUserProgress(userId: string, questionId: string, score: number): Promise<void> {
    // Check if progress exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single();

    const now = new Date().toISOString();
    const isCorrect = score >= 4;

    if (existingProgress) {
      // Update existing progress
      const newBoxNumber = isCorrect 
        ? Math.min(existingProgress.box_number + 1, 5)
        : 1;
      
      const newNextReview = this.calculateNextReview(newBoxNumber);

      await supabase
        .from('user_progress')
        .update({
          last_score: score,
          box_number: newBoxNumber,
          last_reviewed_at: now,
          next_review_at: newNextReview.toISOString(),
          repetition_count: existingProgress.repetition_count + 1,
          correct_count: isCorrect ? existingProgress.correct_count + 1 : existingProgress.correct_count,
          incorrect_count: isCorrect ? existingProgress.incorrect_count : existingProgress.incorrect_count + 1,
          streak: isCorrect ? existingProgress.streak + 1 : 0,
          updated_at: now
        })
        .eq('id', existingProgress.id);
    } else {
      // Create new progress
      const newBoxNumber = isCorrect ? 2 : 1;
      const newNextReview = this.calculateNextReview(newBoxNumber);

      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          question_id: questionId,
          last_score: score,
          box_number: newBoxNumber,
          last_reviewed_at: now,
          next_review_at: newNextReview.toISOString(),
          repetition_count: 1,
          correct_count: isCorrect ? 1 : 0,
          incorrect_count: isCorrect ? 0 : 1,
          streak: isCorrect ? 1 : 0
        });
    }
  }

  private calculateNextReview(boxNumber: number): Date {
    const now = new Date();
    const days = [1, 3, 7, 14, 30][boxNumber - 1] || 1;
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  }

  private transformQuestion(data: any): Question {
    return {
      id: data.id,
      category: data.category,
      sub_category: data.sub_category,
      question_type: data.question_type,
      difficulty: data.difficulty,
      text: data.text,
      image_url: data.image_url,
      answers: data.answers || [],
      created_by: data.created_by,
      revision: data.revision,
      created_at: data.created_at,
      updated_at: data.updated_at,
      regulation_category: data.regulation_category,
      hint: data.hint
    };
  }

  private transformQuestions(data: any[]): Question[] {
    return data.map(this.transformQuestion);
  }

  getCurrentSession(): LearningSession | null {
    return this.currentSession;
  }

  endSession(): void {
    this.currentSession = null;
  }

  // Preload next questions for smooth experience
  async preloadImages(questions: Question[]): Promise<void> {
    const imageUrls = questions
      .map(q => q.image_url)
      .filter(Boolean)
      .slice(0, 3); // Preload next 3 images

    await Promise.all(
      imageUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = url;
        });
      })
    );
  }
}

export const LearningService = new LearningServiceClass();
