import { useState, useCallback, useEffect } from 'react';
import { Question } from '@/types/questions';

interface AnswerRecord {
  questionId: string;
  score: number;
  timestamp: number;
  responseTime: number;
  difficulty: number;
  category: string;
  subcategory: string;
}

interface LearningMetrics {
  averageScore: number;
  averageResponseTime: number;
  streakCount: number;
  difficultyTrend: 'improving' | 'declining' | 'stable';
  categoryPerformance: Record<string, number>;
  learningVelocity: number;
  retentionRate: number;
}

interface SessionStats {
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  averageConfidence: number;
  timeSpent: number;
}

export function useLearningAnalytics() {
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [sessionStart, setSessionStart] = useState<number>(Date.now());
  const [currentQuestionStart, setCurrentQuestionStart] = useState<number>(Date.now());

  // Reset session timing when component mounts
  useEffect(() => {
    setSessionStart(Date.now());
    setCurrentQuestionStart(Date.now());
  }, []);

  const recordAnswer = useCallback((
    question: Question,
    score: number
  ) => {
    const now = Date.now();
    const responseTime = now - currentQuestionStart;
    
    const record: AnswerRecord = {
      questionId: question.id,
      score,
      timestamp: now,
      responseTime,
      difficulty: question.difficulty,
      category: question.category,
      subcategory: question.sub_category
    };

    setAnswers(prev => [...prev, record]);
    setCurrentQuestionStart(now);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('learning_analytics');
    const analytics = stored ? JSON.parse(stored) : { records: [] };
    analytics.records.push(record);
    
    // Keep only last 1000 records
    if (analytics.records.length > 1000) {
      analytics.records = analytics.records.slice(-1000);
    }
    
    localStorage.setItem('learning_analytics', JSON.stringify(analytics));
  }, [currentQuestionStart]);

  const getSessionStats = useCallback((): SessionStats => {
    const sessionAnswers = answers.filter(a => a.timestamp >= sessionStart);
    const correctAnswers = sessionAnswers.filter(a => a.score >= 4);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate streaks
    for (let i = sessionAnswers.length - 1; i >= 0; i--) {
      if (sessionAnswers[i].score >= 4) {
        tempStreak++;
        if (i === sessionAnswers.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        if (i === sessionAnswers.length - 1) {
          currentStreak = 0;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      questionsAnswered: sessionAnswers.length,
      correctAnswers: correctAnswers.length,
      currentStreak,
      longestStreak,
      averageConfidence: sessionAnswers.length > 0 
        ? sessionAnswers.reduce((sum, a) => sum + a.score, 0) / sessionAnswers.length / 5 * 100
        : 0,
      timeSpent: Date.now() - sessionStart
    };
  }, [answers, sessionStart]);

  const getLearningMetrics = useCallback((): LearningMetrics => {
    if (answers.length === 0) {
      return {
        averageScore: 0,
        averageResponseTime: 0,
        streakCount: 0,
        difficultyTrend: 'stable',
        categoryPerformance: {},
        learningVelocity: 0,
        retentionRate: 0
      };
    }

    const recentAnswers = answers.slice(-20); // Last 20 answers
    const averageScore = recentAnswers.reduce((sum, a) => sum + a.score, 0) / recentAnswers.length;
    const averageResponseTime = recentAnswers.reduce((sum, a) => sum + a.responseTime, 0) / recentAnswers.length;

    // Calculate difficulty trend
    const firstHalf = recentAnswers.slice(0, Math.floor(recentAnswers.length / 2));
    const secondHalf = recentAnswers.slice(Math.floor(recentAnswers.length / 2));
    const firstAvg = firstHalf.reduce((sum, a) => sum + a.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, a) => sum + a.score, 0) / secondHalf.length;
    
    let difficultyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (secondAvg > firstAvg + 0.5) difficultyTrend = 'improving';
    else if (firstAvg > secondAvg + 0.5) difficultyTrend = 'declining';

    // Category performance
    const categoryPerformance: Record<string, number> = {};
    answers.forEach(answer => {
      if (!categoryPerformance[answer.category]) {
        categoryPerformance[answer.category] = 0;
      }
      categoryPerformance[answer.category] += answer.score;
    });

    // Normalize category performance
    Object.keys(categoryPerformance).forEach(category => {
      const categoryAnswers = answers.filter(a => a.category === category);
      categoryPerformance[category] = categoryPerformance[category] / categoryAnswers.length;
    });

    return {
      averageScore,
      averageResponseTime,
      streakCount: getSessionStats().currentStreak,
      difficultyTrend,
      categoryPerformance,
      learningVelocity: answers.length / ((Date.now() - sessionStart) / 1000 / 60), // questions per minute
      retentionRate: (answers.filter(a => a.score >= 4).length / answers.length) * 100
    };
  }, [answers, sessionStart, getSessionStats]);

  const getPerformancePrediction = useCallback((question: Question): number => {
    const categoryAnswers = answers.filter(a => a.category === question.category);
    if (categoryAnswers.length === 0) return 0.5; // No data, assume 50% confidence

    const recentCategoryAnswers = categoryAnswers.slice(-5);
    const avgScore = recentCategoryAnswers.reduce((sum, a) => sum + a.score, 0) / recentCategoryAnswers.length;
    const avgResponseTime = recentCategoryAnswers.reduce((sum, a) => sum + a.responseTime, 0) / recentCategoryAnswers.length;

    // Consider difficulty, recent performance, and response time
    let confidence = (avgScore / 5) * 0.7; // 70% weight on score
    confidence += (avgResponseTime < 5000 ? 0.2 : 0.1); // 20% weight on response time
    confidence += (question.difficulty <= 3 ? 0.1 : 0); // 10% weight on difficulty

    return Math.min(Math.max(confidence, 0), 1);
  }, [answers]);

  return {
    recordAnswer,
    getSessionStats,
    getLearningMetrics,
    getPerformancePrediction,
    answers: answers.length
  };
}
