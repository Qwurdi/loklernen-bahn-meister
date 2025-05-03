
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

// Define learning box intervals
export const LEARNING_BOXES = [
  { id: 1, name: "Box 1", days: [1], color: "bg-loklernen-coral", border: "border-loklernen-coral/60", gradient: "bg-gradient-to-t from-loklernen-coral to-loklernen-coral/80" },
  { id: 2, name: "Box 2", days: [6], color: "bg-amber-500", border: "border-amber-400", gradient: "bg-gradient-to-t from-amber-500 to-amber-400" },
  { id: 3, name: "Box 3", days: [7, 14], color: "bg-loklernen-lavender", border: "border-loklernen-lavender/60", gradient: "bg-gradient-to-t from-loklernen-lavender to-loklernen-lavender/80" },
  { id: 4, name: "Box 4", days: [15, 30], color: "bg-loklernen-tranquil", border: "border-loklernen-tranquil/60", gradient: "bg-gradient-to-t from-loklernen-tranquil to-loklernen-tranquil/80" },
  { id: 5, name: "Box 5", days: [31, 999], color: "bg-loklernen-mint", border: "border-loklernen-mint/60", gradient: "bg-gradient-to-t from-loklernen-mint to-loklernen-mint/80" }
];

export interface BoxStats {
  boxNumber: number;  // Changed from boxId to boxNumber for consistency
  count: number;
  color: string;
  border: string;
  name: string;
  due?: number; // Added due property as optional
  gradient?: string;
}

interface LearningBoxesDisplayProps {
  boxStats: BoxStats[];
  isLoading?: boolean;
}

export default function LearningBoxesDisplay({ boxStats, isLoading = false }: LearningBoxesDisplayProps) {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-16 flex-1" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {boxStats.map((box: BoxStats) => (
        <div key={box.boxNumber} className="flex flex-col items-center">
          <div className="relative w-full">
            <div 
              className={`${box.gradient || box.color} w-full rounded-t-md border-t border-l border-r ${box.border} backdrop-blur-sm animate-float`} 
              style={{ 
                height: `${Math.max(24, Math.min(80, box.count * 4))}px`,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            />
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black px-2 py-0.5 rounded-full border border-gray-700">
              <span className="text-xs font-medium">{box.count}</span>
            </div>
            
            {/* Add glow effect for due cards */}
            {box.due && box.due > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-loklernen-coral rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="text-center mt-1 bg-gray-800/80 backdrop-blur-sm w-full rounded-b-md border-b border-l border-r border-gray-700 py-1">
            <span className={`text-xs ${isMobile ? '' : 'font-semibold'} text-gray-200`}>
              {isMobile ? `B${box.boxNumber}` : box.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
