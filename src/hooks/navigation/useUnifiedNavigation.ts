
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { URLBuilder } from '@/utils/url-builder';
import { LearningSessionParams } from '@/types/navigation';

export function useUnifiedNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToLearning = useCallback((params: LearningSessionParams) => {
    const path = URLBuilder.buildLearningPath(params);
    navigate(path);
  }, [navigate]);

  const navigateToCategory = useCallback((category: string, subcategory?: string) => {
    const path = URLBuilder.buildCategoryPath(category, subcategory);
    navigate(path);
  }, [navigate]);

  const getCurrentParams = useCallback((): LearningSessionParams => {
    return URLBuilder.parseLearningURL(location.pathname + location.search);
  }, [location]);

  const updateParams = useCallback((updates: Partial<LearningSessionParams>) => {
    const current = getCurrentParams();
    const newParams = { ...current, ...updates };
    navigateToLearning(newParams);
  }, [getCurrentParams, navigateToLearning]);

  return {
    navigateToLearning,
    navigateToCategory,
    getCurrentParams,
    updateParams
  };
}
