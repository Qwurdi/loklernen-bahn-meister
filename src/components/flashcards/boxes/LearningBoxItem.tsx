
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
  // Box gradient based on number - using our trend colors with improved gradients
  const getBoxGradient = () => {
    switch (boxNumber) {
      case 1: return "from-loklernen-coral to-loklernen-coral/80";
      case 2: return "from-amber-500 to-amber-400";
      case 3: return "from-loklernen-tranquil to-blue-400";
      case 4: return "from-blue-400 to-loklernen-tranquil";
      case 5: return "from-loklernen-mint to-loklernen-mint/80";
      default: return "from-gray-500 to-gray-400";
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
        "cursor-pointer transition-all duration-300 hover:translate-y-[-3px] flex flex-col h-[120px] relative rounded-lg overflow-hidden backdrop-blur-sm",
        isActive 
          ? "border-2 border-loklernen-ultramarine shadow-lg shadow-loklernen-ultramarine/20" 
          : "border border-white/10 hover:border-loklernen-ultramarine/50"
      )}
    >
      {/* Colored top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getBoxGradient()}`} />
      
      <div className="flex flex-col flex-1 p-3 bg-black/30 backdrop-filter backdrop-blur-md">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-white">Box {boxNumber}</span>
          {dueCards > 0 && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full text-black font-medium animate-pulse",
              getIndicatorColor()
            )}>{dueCards}</span>
          )}
        </div>
        
        {/* Progress bar with full width */}
        <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden mt-1 backdrop-blur-md">
          <div 
            className={`h-full bg-gradient-to-r ${getBoxGradient()} animate-pulse`}
            style={{ width: `${totalCards > 0 ? 100 : 0}%`, opacity: totalCards > 0 ? 1 : 0.3 }} 
          />
        </div>
        
        <div className="flex justify-between items-baseline mt-auto pt-1">
          <span className="text-2xl font-bold text-white">{totalCards}</span>
          <span className="text-xs text-gray-400">{getIntervalText()}</span>
        </div>

        {/* Enhanced indicator for active state */}
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-loklernen-ultramarine via-loklernen-ultramarine/80 to-loklernen-ultramarine/40 animate-pulse"></div>
        )}
      </div>
    </div>
  );
}
