
import React from 'react';
import MinimalistLoader from './MinimalistLoader';

interface EnhancedLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({ 
  message = "Lade Inhalte...", 
  size = 'md',
  className = ''
}) => {
  // Simply return our new minimalist loader component
  return (
    <MinimalistLoader 
      message={message} 
      size={size} 
      className={className} 
    />
  );
};

export default EnhancedLoadingSpinner;
