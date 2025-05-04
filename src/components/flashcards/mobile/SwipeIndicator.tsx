
import React from "react";

interface SwipeIndicatorProps {
  dragDelta: number;
  swipeThreshold: number;
}

export default function SwipeIndicator({ dragDelta, swipeThreshold }: SwipeIndicatorProps) {
  if (dragDelta === 0) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div 
        className={`text-4xl font-bold transition-opacity ${
          Math.abs(dragDelta) < swipeThreshold / 2 ? 'opacity-0' : 'opacity-80'
        } ${
          dragDelta > 0 ? 'text-green-600' : 'text-red-500'
        } bg-white/80 px-6 py-2 rounded-full shadow-sm`}
      >
        {dragDelta > 0 ? 'Gewusst' : 'Nicht gewusst'}
      </div>
    </div>
  );
}
