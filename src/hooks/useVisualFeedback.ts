
import { useCallback } from 'react';

interface FeedbackConfig {
  duration?: number;
  intensity?: 'subtle' | 'medium' | 'strong';
  type?: 'success' | 'error' | 'neutral' | 'info';
}

export function useVisualFeedback() {
  const showFeedback = useCallback((
    element: HTMLElement,
    config: FeedbackConfig = {}
  ) => {
    const {
      duration = 200,
      intensity = 'medium',
      type = 'neutral'
    } = config;

    // Store original styles
    const originalTransform = element.style.transform;
    const originalBoxShadow = element.style.boxShadow;
    const originalTransition = element.style.transition;

    // Define feedback styles based on type
    const feedbackStyles = {
      success: {
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
        backgroundColor: 'rgba(34, 197, 94, 0.05)'
      },
      error: {
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)'
      },
      neutral: {
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      },
      info: {
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)'
      }
    };

    const scaleAmount = intensity === 'subtle' ? 1.02 : intensity === 'medium' ? 1.05 : 1.08;

    // Apply feedback styles
    element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    element.style.transform = `${originalTransform || ''} scale(${scaleAmount})`.trim();
    element.style.boxShadow = feedbackStyles[type].boxShadow;
    
    // Apply background overlay if supported
    const overlay = element.querySelector('.feedback-overlay') as HTMLElement;
    if (overlay) {
      overlay.style.backgroundColor = feedbackStyles[type].backgroundColor;
      overlay.style.opacity = '1';
    }

    // Reset after duration
    setTimeout(() => {
      element.style.transition = `all ${duration}ms ease-out`;
      element.style.transform = originalTransform;
      element.style.boxShadow = originalBoxShadow;
      
      if (overlay) {
        overlay.style.opacity = '0';
      }

      // Restore original transition after animation
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, duration);
    }, duration);
  }, []);

  const pulseHighlight = useCallback((element: HTMLElement, color: string = '#3F00FF') => {
    const originalBoxShadow = element.style.boxShadow;
    
    element.style.transition = 'box-shadow 300ms ease-out';
    element.style.boxShadow = `0 0 25px ${color}40`;
    
    setTimeout(() => {
      element.style.boxShadow = originalBoxShadow;
    }, 300);
  }, []);

  // Simplified feedback for mobile swipe cards
  const showSwipeFeedback = useCallback((type: 'success' | 'error') => {
    // Create a temporary feedback indicator
    const indicator = document.createElement('div');
    indicator.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 
      w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
      animate-scale-in pointer-events-none`;
    indicator.textContent = type === 'success' ? '✓' : '✗';
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.remove();
    }, 800);
  }, []);

  return {
    showFeedback,
    pulseHighlight,
    showSwipeFeedback
  };
}
