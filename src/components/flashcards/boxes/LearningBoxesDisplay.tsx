
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

// Define learning box intervals
export const LEARNING_BOXES = [
  { id: 1, name: "Box 1", days: [1], color: "bg-red-500", border: "border-red-400" },
  { id: 2, name: "Box 2", days: [6], color: "bg-amber-500", border: "border-amber-400" },
  { id: 3, name: "Box 3", days: [7, 14], color: "bg-yellow-400", border: "border-yellow-300" },
  { id: 4, name: "Box 4", days: [15, 30], color: "bg-lime-500", border: "border-lime-400" },
  { id: 5, name: "Box 5", days: [31, 999], color: "bg-green-600", border: "border-green-500" }
];

export interface BoxStats {
  boxNumber: number;  // Changed from boxId to boxNumber for consistency
  count: number;
  color: string;
  border: string;
  name: string;
  due?: number; // Added due property as optional
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
              className={`${box.color} w-full rounded-t-md border-t border-l border-r ${box.border}`} 
              style={{ height: `${Math.max(24, Math.min(80, box.count * 4))}px` }}
            />
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-900 px-1 rounded">
              <span className="text-xs font-medium">{box.count}</span>
            </div>
          </div>
          <div className="text-center mt-1 bg-gray-800 w-full rounded-b-md border-b border-l border-r border-gray-700 py-1">
            <span className={`text-xs ${isMobile ? '' : 'font-semibold'} text-gray-200`}>
              {isMobile ? `B${box.boxNumber}` : box.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
