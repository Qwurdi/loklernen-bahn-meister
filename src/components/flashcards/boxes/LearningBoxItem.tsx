
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LearningBoxItemProps {
  boxNumber: number;
  totalCards: number;
  dueCards: number;
  isActive: boolean;
  onClick: () => void;
}

export default function LearningBoxItem({
  boxNumber,
  totalCards,
  dueCards,
  isActive,
  onClick
}: LearningBoxItemProps) {
  // Box color based on number
  const getBoxColor = () => {
    switch (boxNumber) {
      case 1: return "bg-red-500";
      case 2: return "bg-amber-500";
      case 3: return "bg-yellow-400";
      case 4: return "bg-lime-500";
      case 5: return "bg-green-600";
      default: return "bg-gray-500";
    }
  };
  
  // Box border color based on number
  const getBoxBorder = () => {
    switch (boxNumber) {
      case 1: return "border-red-400";
      case 2: return "border-amber-400";
      case 3: return "border-yellow-300";
      case 4: return "border-lime-400";
      case 5: return "border-green-500";
      default: return "border-gray-400";
    }
  };
  
  // Get review interval text
  const getIntervalText = () => {
    switch (boxNumber) {
      case 1: return "1 Tag";
      case 2: return "6 Tage";
      case 3: return "7-14 Tage";
      case 4: return "15-30 Tage";
      case 5: return "31+ Tage";
      default: return "";
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border p-3 flex flex-col",
        isActive ? "bg-gray-800 border-loklernen-ultramarine shadow-loklernen-ultramarine/20 shadow-sm" : "bg-gray-900 border-gray-800"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-medium">Box {boxNumber}</span>
        {dueCards > 0 && (
          <span className="text-xs bg-amber-500 text-black px-1.5 rounded-full">{dueCards}</span>
        )}
      </div>
      
      {/* Bar visualization */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-1">
        <div 
          className={`h-full ${getBoxColor()}`}
          style={{ width: `${totalCards > 0 ? 100 : 0}%` }} 
        />
      </div>
      
      <div className="flex justify-between items-baseline mt-2">
        <span className="text-lg font-bold">{totalCards}</span>
        <span className="text-xs text-gray-400">{getIntervalText()}</span>
      </div>
    </Card>
  );
}
