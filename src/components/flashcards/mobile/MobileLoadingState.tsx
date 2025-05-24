
import React from 'react';
import MinimalistLoader from '@/components/common/MinimalistLoader';

export default function MobileLoadingState() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <MinimalistLoader 
        message="Karteikarten werden geladen..." 
        size="lg" 
      />
    </div>
  );
}
