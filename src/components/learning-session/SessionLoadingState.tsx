
import React from 'react';
import EnhancedLoadingSpinner from "@/components/common/EnhancedLoadingSpinner";
import { useMediaQuery } from '@/hooks/use-mobile';

interface SessionLoadingStateProps {
  message?: string;
}

const SessionLoadingState: React.FC<SessionLoadingStateProps> = ({ message = "Lade Lernsession..." }) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const size = useMediaQuery('(max-width: 768px)') ? "md" : "lg";
  
  if (prefersReducedMotion) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[300px]">
        <div className="text-center">
          <div 
            className="mb-4 h-12 w-12 rounded-full border-4 border-loklernen-ultramarine border-t-transparent mx-auto spinner-rotate"
          />
          <p>{message}</p>
        </div>
      </div>
    );
  }
  
  return <EnhancedLoadingSpinner message={message} size={size as 'md' | 'lg'} />;
};

export default SessionLoadingState;
