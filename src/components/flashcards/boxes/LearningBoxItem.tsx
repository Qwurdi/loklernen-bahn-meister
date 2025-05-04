
import React from 'react';
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
  // Box gradient based on number - using our trend colors with lighter gradients
  const getBoxGradient = () => {
    switch (boxNumber) {
      case 1: return "from-loklernen-coral/80 to-loklernen-coral/20";
      case 2: return "from-amber-400 to-amber-200";
      case 3: return "from-loklernen-tranquil/80 to-loklernen-tranquil/20";
      case 4: return "from-blue-400/80 to-blue-300/20";
      case 5: return "from-loklernen-mint/80 to-loklernen-mint/20";
      default: return "from-gray-400 to-gray-200";
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
  
  // Box indicator color based on number
  const getIndicatorColor = () => {
    switch (boxNumber) {
      case 1: return "bg-loklernen-coral";
      case 2: return "bg-amber-500";
      case 3: return "bg-loklernen-tranquil";
      case 4: return "bg-blue-400";
      case 5: return "bg-loklernen-mint";
      default: return "bg-gray-500";
    }
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col h-[120px] relative rounded-lg overflow-hidden bg-white",
        isActive 
          ? "border-2 border-loklernen-ultramarine shadow-md shadow-loklernen-ultramarine/10" 
          : "border border-gray-200 hover:border-loklernen-ultramarine/30 shadow-sm"
      )}
    >
      {/* Colored top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getBoxGradient()}`} />
      
      <div className="flex flex-col flex-1 p-3">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-gray-700">Box {boxNumber}</span>
          {dueCards > 0 && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full text-white font-medium animate-pulse",
              getIndicatorColor()
            )}>{dueCards}</span>
          )}
        </div>
        
        {/* Progress bar with full width */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
          <div 
            className={`h-full bg-gradient-to-r ${getBoxGradient()}`}
            style={{ width: `${totalCards > 0 ? 100 : 0}%`, opacity: totalCards > 0 ? 1 : 0.3 }} 
          />
        </div>
        
        <div className="flex justify-between items-baseline mt-auto pt-1">
          <span className="text-2xl font-bold text-gray-800">{totalCards}</span>
          <span className="text-xs text-gray-500">{getIntervalText()}</span>
        </div>

        {/* Enhanced indicator for active state */}
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-loklernen-ultramarine via-loklernen-ultramarine/80 to-loklernen-ultramarine/40"></div>
        )}
      </div>
    </div>
  );
}
