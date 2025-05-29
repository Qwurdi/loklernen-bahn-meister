
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SessionProgressProps {
  current: number;
  total: number;
  correctCount: number;
  className?: string;
}

export default function SessionProgress({ current, total, correctCount, className = '' }: SessionProgressProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Karte {current} von {total}
          </span>
          <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">{correctCount} richtig</span>
        </div>
        {current > 1 && (
          <div className="text-gray-500">
            {Math.round((correctCount / (current - 1)) * 100)}% Erfolgsrate
          </div>
        )}
      </div>
    </div>
  );
}
