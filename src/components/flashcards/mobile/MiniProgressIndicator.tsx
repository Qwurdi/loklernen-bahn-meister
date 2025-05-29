
import React from 'react';

interface MiniProgressIndicatorProps {
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  remainingToday: number;
}

export default function MiniProgressIndicator({
  currentIndex,
  totalCards,
  correctCount,
  remainingToday
}: MiniProgressIndicatorProps) {
  // Calculate success rate
  const successRate = currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 0;
  const successColor = successRate > 70 ? 'text-green-500' : successRate > 40 ? 'text-yellow-500' : 'text-red-500';
  
  return (
    <div className="flex items-center justify-between px-4 pt-14 pb-2">
      <div className="flex items-center gap-1">
        <div className="w-6 h-6 rounded-full bg-loklernen-sapphire flex items-center justify-center text-white font-medium text-xs">
          {currentIndex + 1}
        </div>
        <span className="text-xs text-gray-400">/{totalCards}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className={`text-xs ${successColor}`}>
          {successRate}%
        </div>
        
        <div className="text-xs py-0.5 px-2 bg-gray-800/60 rounded-full text-gray-300 border border-gray-700">
          {remainingToday} übrig
        </div>
      </div>
    </div>
  );
}
