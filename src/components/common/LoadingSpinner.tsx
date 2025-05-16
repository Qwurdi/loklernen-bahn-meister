
import React from 'react';
import EnhancedLoadingSpinner from './EnhancedLoadingSpinner';
import { useMediaQuery } from '@/hooks/use-mobile';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  // Use prefers-reduced-motion media query for accessibility
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Show simple spinner for users who prefer reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div 
          className="h-10 w-10 rounded-full border-4 border-loklernen-ultramarine border-t-transparent spinner-rotate"
          role="status"
          aria-label={message || "Inhalt wird geladen"}
        />
        {message && <p className="ml-3 text-white">{message}</p>}
      </div>
    );
  }
  
  // Show enhanced animation for everyone else
  return <EnhancedLoadingSpinner message={message} size="md" />;
};

export default LoadingSpinner;
