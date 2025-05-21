
import React from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

interface SwipeIndicatorProps {
  dragDelta: number;
  swipeThreshold: number;
}

export default function SwipeIndicator({ dragDelta, swipeThreshold }: SwipeIndicatorProps) {
  // Calculate opacity based on how close we are to the threshold
  const leftOpacity = Math.min(Math.abs(Math.min(dragDelta, 0)) / swipeThreshold, 1);
  const rightOpacity = Math.min(Math.max(dragDelta, 0) / swipeThreshold, 1);

  return (
    <div className="absolute inset-x-0 bottom-1/4 z-10 pointer-events-none flex justify-between px-10">
      {/* Left indicator - not known */}
      <div className="flex items-center" style={{ opacity: leftOpacity }}>
        <div className="bg-red-100 text-red-600 rounded-full h-12 w-12 flex items-center justify-center border-2 border-red-300">
          <X className="h-6 w-6" />
        </div>
        <div className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded">
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          Nicht gewusst
        </div>
      </div>
      
      {/* Right indicator - known */}
      <div className="flex items-center" style={{ opacity: rightOpacity }}>
        <div className="mr-2 bg-green-100 text-green-600 px-2 py-1 rounded">
          Gewusst
          <ArrowRight className="h-4 w-4 inline ml-1" />
        </div>
        <div className="bg-green-100 text-green-600 rounded-full h-12 w-12 flex items-center justify-center border-2 border-green-300">
          <Check className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
