
import React from 'react';
import { Check, X } from 'lucide-react';

interface SwipeIndicatorProps {
  dragDelta: number;
  swipeThreshold: number;
}

export default function SwipeIndicator({ dragDelta, swipeThreshold }: SwipeIndicatorProps) {
  // Don't show until dragDelta is significant
  if (Math.abs(dragDelta) < 10) return null;
  
  // Calculate opacity based on drag distance
  const opacity = Math.min(Math.abs(dragDelta) / swipeThreshold, 1) * 0.8;
  
  // Swipe left (not known)
  if (dragDelta < 0) {
    return (
      <div 
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-red-500 rounded-full"
        style={{ opacity }}
      >
        <X className="text-white h-6 w-6" />
      </div>
    );
  }
  
  // Swipe right (known)
  return (
    <div 
      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-green-500 rounded-full"
      style={{ opacity }}
    >
      <Check className="text-white h-6 w-6" />
    </div>
  );
}
