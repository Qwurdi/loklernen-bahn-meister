
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-loklernen-ultramarine border-t-transparent" />
    </div>
  );
};

export default LoadingSpinner;
