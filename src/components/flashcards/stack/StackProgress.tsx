
import React from 'react';

interface StackProgressProps {
  total: number;
  current: number;
  className?: string;
}

export default function StackProgress({ 
  total, 
  current, 
  className = '' 
}: StackProgressProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className={`stack-progress px-1 pt-1 pb-2 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-loklernen-sapphire flex items-center justify-center text-white font-medium text-xs">
            {current}
          </div>
          <span className="text-xs text-gray-600">/{total}</span>
        </div>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-loklernen-sapphire transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
