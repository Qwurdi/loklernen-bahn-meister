
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useSpacedRepetition } from '@/hooks/spaced-repetition';
import { useCategories } from '@/hooks/useCategories';
import { validateCategory, validateMode, validateBoxNumber } from './guards';
import { SessionOptions } from '@/types/spaced-repetition';

export function useLearningSession() {
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Load categories for validation
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // Parse and validate URL parameters - removed regulation handling
  const sessionOptions: SessionOptions = useMemo(() => {
    const categoryParam = searchParams.get('category') || searchParams.get('parent_category');
    const subcategoryParam = searchParams.get('subcategory');
    const modeParam = searchParams.get('mode');
    const boxParam = searchParams.get('box');
    const practiceParam = searchParams.get('practice');

    const category = validateCategory(categoryParam);
    const mode = practiceParam === 'true' ? 'practice' : validateMode(modeParam);
    const boxNumber = validateBoxNumber(boxParam);

    return {
      category: category || undefined,
      subcategory: subcategoryParam || undefined,
      regulation: regulationPreference, // Use global preference
      mode: boxNumber ? 'boxes' : mode,
      boxNumber,
      batchSize: 15,
      includeAllSubcategories: !subcategoryParam && !!category
    };
  }, [searchParams, regulationPreference]); // Added regulationPreference dependency

  // Check if category requires authentication
  const categoryRequiresAuth = useMemo(() => {
    if (!categories || categoriesLoading) return false;
    
    const category = categories.find(c => 
      c.name === sessionOptions.category || 
      c.parent_category === sessionOptions.category
    );
    
    return category?.requiresAuth === true;
  }, [categories, categoriesLoading, sessionOptions.category]);

  // Determine if user can access this session
  const canAccess = useMemo(() => {
    if (categoriesLoading) return false;
    if (categoryRequiresAuth && !user) return false;
    return true;
  }, [categoriesLoading, categoryRequiresAuth, user]);

  // Use spaced repetition hook
  const {
    questions: sessionQuestions,
    loading: questionsLoading,
    error: questionsError,
    progress,
    submitAnswer,
    loadQuestions,
    reset
  } = useSpacedRepetition(sessionOptions);

  // Load questions when parameters change and user can access
  useEffect(() => {
    if (canAccess && sessionOptions.category) {
      loadQuestions(sessionOptions);
    }
  }, [canAccess, sessionOptions, loadQuestions]);

  // Session data
  const sessionTitle = useMemo(() => {
    if (sessionOptions.subcategory) return sessionOptions.subcategory;
    if (sessionOptions.category) return sessionOptions.category;
    return 'Lerneinheit';
  }, [sessionOptions]);

  const questions = useMemo(() => {
    return sessionQuestions.map(sq => sq.question);
  }, [sessionQuestions]);

  const isPracticeMode = !user;
  const isDueCardsView = sessionOptions.mode === 'review' && !sessionOptions.boxNumber;

  // Actions
  const handleAnswer = async (questionId: string, score: number) => {
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }

    if (user && submitAnswer) {
      await submitAnswer(questionId, score);
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
    
    if (canAccess && sessionOptions.category) {
      loadQuestions(sessionOptions);
    }
  };

  return {
    // Loading states
    loading: categoriesLoading || questionsLoading,
    categoriesLoading,
    questionsLoading,
    error: categoriesError || questionsError,
    
    // Access control
    canAccess,
    categoryRequiresAuth,
    
    // Data
    questions,
    user,
    categories,
    
    // Session state
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    progress,
    
    // Parameters and metadata
    sessionOptions,
    sessionTitle,
    isDueCardsView,
    isPracticeMode,
    
    // Actions
    handleAnswer,
    handleComplete,
    handleRestart,
    navigate,
    
    // Advanced
    submitAnswer,
    loadQuestions,
    reset
  };
}
