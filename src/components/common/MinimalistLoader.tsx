
import React from 'react';

interface MinimalistLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MinimalistLoader: React.FC<MinimalistLoaderProps> = ({
  message,
  size = 'md',
  className = '',
}) => {
  // Determine size based on the prop
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];
  
  const containerClasses = {
    sm: 'min-h-[10vh]',
    md: 'min-h-[20vh]',
    lg: 'min-h-[30vh]',
  }[size];
  
  return (
    <div 
      className={`flex ${containerClasses} w-full items-center justify-center flex-col ${className}`}
      role="status"
      aria-label={message || "Inhalt wird geladen"}
    >
      <div 
        className={`${sizeClasses} rounded-full bg-gradient-ultramarine gradient-shift shadow-md flex items-center justify-center relative overflow-hidden`}
        style={{
          animation: 'pulse 2s ease-in-out infinite'
        }}
      >
        <div className="w-3/4 h-3/4 rounded-full bg-black/10"></div>
      </div>
      
      {message && (
        <p className="mt-4 text-center text-gray-300">{message}</p>
      )}
    </div>
  );
};

export default MinimalistLoader;
