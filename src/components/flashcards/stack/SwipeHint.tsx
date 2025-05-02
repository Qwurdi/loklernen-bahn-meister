
import React from 'react';
import { Check, X } from 'lucide-react';

interface SwipeHintProps {
  direction: 'left' | 'right' | null;
  dragDelta: number;
}

export default function SwipeHint({ direction, dragDelta }: SwipeHintProps) {
  if (!direction) return null;
  
  // Calculate opacity based on drag distance (max 1 at threshold)
  const threshold = 100;
  const opacity = Math.min(Math.abs(dragDelta) / threshold, 1);
  
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {direction === 'right' ? (
        <div 
          className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full p-4"
          style={{ opacity }}
        >
          <Check size={48} strokeWidth={3} />
        </div>
      ) : (
        <div 
          className="inline-flex items-center justify-center bg-red-100 text-red-600 rounded-full p-4"
          style={{ opacity }}
        >
          <X size={48} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
