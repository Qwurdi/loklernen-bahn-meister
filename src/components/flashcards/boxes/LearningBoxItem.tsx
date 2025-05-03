
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
  // Box color based on number - using our trend colors
  const getBoxColor = () => {
    switch (boxNumber) {
      case 1: return "bg-loklernen-coral";
      case 2: return "bg-amber-500"; 
      case 3: return "bg-loklernen-lavender";
      case 4: return "bg-loklernen-tranquil";
      case 5: return "bg-loklernen-mint";
      default: return "bg-gray-500";
    }
  };
  
  // Box gradient based on number - using our trend colors
  const getBoxGradient = () => {
    switch (boxNumber) {
      case 1: return "bg-gradient-to-br from-loklernen-coral to-loklernen-coral/80";
      case 2: return "bg-gradient-to-br from-amber-500 to-amber-400";
      case 3: return "bg-gradient-to-br from-loklernen-lavender to-loklernen-lavender/80";
      case 4: return "bg-gradient-to-br from-loklernen-tranquil to-loklernen-tranquil/80";
      case 5: return "bg-gradient-to-br from-loklernen-mint to-loklernen-mint/80";
      default: return "bg-gradient-to-br from-gray-500 to-gray-400";
    }
  };
  
  // Box border color based on number
  const getBoxBorder = () => {
    switch (boxNumber) {
      case 1: return "border-loklernen-coral/40";
      case 2: return "border-amber-400/40";
      case 3: return "border-loklernen-lavender/40";
      case 4: return "border-loklernen-tranquil/40";
      case 5: return "border-loklernen-mint/40";
      default: return "border-gray-400/40";
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
        "cursor-pointer transition-all hover:translate-y-[-3px] border p-3 flex flex-col h-[120px] glass-card",
        isActive 
          ? "border-loklernen-ultramarine shadow-lg shadow-loklernen-ultramarine/20" 
          : "border-gray-700 hover:border-loklernen-tranquil/50"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-white">Box {boxNumber}</span>
        {dueCards > 0 && (
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full text-black animate-pulse",
            boxNumber === 1 ? "bg-loklernen-coral" :
            boxNumber === 2 ? "bg-amber-500" :
            boxNumber === 3 ? "bg-loklernen-lavender" :
            boxNumber === 4 ? "bg-loklernen-tranquil" :
            "bg-loklernen-mint"
          )}>{dueCards}</span>
        )}
      </div>
      
      {/* Bar visualization with gradient */}
      <div className="h-2.5 bg-black/30 rounded-full overflow-hidden mt-1 backdrop-blur-sm">
        <div 
          className={`h-full ${getBoxGradient()}`}
          style={{ width: `${totalCards > 0 ? 100 : 0}%` }} 
        />
      </div>
      
      <div className="flex justify-between items-baseline mt-auto">
        <span className="text-xl font-bold text-white">{totalCards}</span>
        <span className="text-xs text-gray-300">{getIntervalText()}</span>
      </div>

      {/* Add subtle indicator for active state */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-loklernen-ultramarine rounded-full"></div>
      )}
    </Card>
  );
}
