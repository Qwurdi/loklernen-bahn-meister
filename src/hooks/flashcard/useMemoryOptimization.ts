
import { useEffect, useRef, useCallback } from 'react';
import { Question } from '@/types/questions';

interface UseMemoryOptimizationProps {
  questions: Question[];
  currentIndex: number;
  windowSize?: number;
}

export function useMemoryOptimization({
  questions,
  currentIndex,
  windowSize = 5
}: UseMemoryOptimizationProps) {
  const renderedQuestions = useRef<Map<string, Question>>(new Map());
  const observerRef = useRef<IntersectionObserver>();

  // Calculate visible window of questions
  const getVisibleWindow = useCallback(() => {
    const start = Math.max(0, currentIndex - Math.floor(windowSize / 2));
    const end = Math.min(questions.length, start + windowSize);
    return { start, end };
  }, [currentIndex, windowSize, questions.length]);

  // Update rendered questions based on visible window
  const updateRenderedQuestions = useCallback(() => {
    const { start, end } = getVisibleWindow();
    const newRendered = new Map<string, Question>();
    
    for (let i = start; i < end; i++) {
      const question = questions[i];
      if (question) {
        newRendered.set(question.id, question);
      }
    }
    
    renderedQuestions.current = newRendered;
  }, [getVisibleWindow, questions]);

  // Update when currentIndex or questions change
  useEffect(() => {
    updateRenderedQuestions();
  }, [updateRenderedQuestions]);

  // Setup intersection observer for DOM cleanup
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Element is not visible, could be cleaned up
            const element = entry.target as HTMLElement;
            const questionId = element.dataset.questionId;
            
            if (questionId && !renderedQuestions.current.has(questionId)) {
              // Remove from DOM if not in current window
              element.remove();
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0
      }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  // Register element for observation
  const registerElement = useCallback((element: HTMLElement, questionId: string) => {
    element.dataset.questionId = questionId;
    observerRef.current?.observe(element);
  }, []);

  // Unregister element
  const unregisterElement = useCallback((element: HTMLElement) => {
    observerRef.current?.unobserve(element);
  }, []);

  // Check if question should be rendered
  const shouldRender = useCallback((questionId: string) => {
    return renderedQuestions.current.has(questionId);
  }, []);

  // Get memory stats
  const getMemoryStats = useCallback(() => {
    return {
      renderedCount: renderedQuestions.current.size,
      totalCount: questions.length,
      windowSize,
      currentIndex,
      memoryUsage: ((renderedQuestions.current.size / questions.length) * 100).toFixed(1) + '%'
    };
  }, [questions.length, windowSize, currentIndex]);

  return {
    shouldRender,
    registerElement,
    unregisterElement,
    getMemoryStats,
    renderedQuestions: renderedQuestions.current
  };
}
