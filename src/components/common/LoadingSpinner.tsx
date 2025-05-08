import React from 'react';
import '../../styles/animations.css';

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div 
        className="h-10 w-10 rounded-full border-4 border-loklernen-ultramarine border-t-transparent animate-spin"
      />
    </div>
  );
};

export default LoadingSpinner;
