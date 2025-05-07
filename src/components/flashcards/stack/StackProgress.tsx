
import React from 'react';
import { Progress } from "@/components/ui/progress";
import '@/styles/animations.css';

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
    <div className={`stack-progress px-4 pt-2 pb-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="card-white rounded-lg px-3 py-1.5 shadow-md flex items-center justify-center">
            <span className="text-loklernen-ultramarine font-semibold">{current}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-gray-500">{total}</span>
          </div>
          <span className="text-xs text-gray-500">Karte</span>
        </div>
        
        <div className="text-xs py-0.5 px-2 bg-gray-100 rounded-full text-gray-600 border border-gray-200 shadow-sm">
          {total - current} übrig
        </div>
      </div>
      
      <div className="relative mt-3">
        <Progress 
          value={percentage} 
          className="h-1.5 bg-gray-200" 
          indicatorClassName="bg-gradient-ultramarine gradient-shift"
        />
      </div>
    </div>
  );
}
