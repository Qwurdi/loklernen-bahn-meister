
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div 
        className="h-10 w-10 rounded-full border-4 border-loklernen-ultramarine border-t-transparent"
        style={{ animation: 'spinner-rotation 1s linear infinite' }}
      />
      <style jsx global>{`
        @keyframes spinner-rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
