
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LearningBoxItemProps {
  boxNumber: number;
  totalCards: number;
  dueCards: number;
  isActive: boolean;
  onClick: () => void;
  showPreview?: boolean;
}

export default function LearningBoxItem({
  boxNumber, 
  totalCards, 
  dueCards,
  isActive,
  onClick,
  showPreview = false
}: LearningBoxItemProps) {
  // Display names for boxes
  const boxNames = [
    "Neu/Schwierig",
    "Etwas gelernt",
    "Gut gelernt",
    "Fast gemeistert",
    "Gemeistert"
  ];
  
  // Streak requirements for each box
  const streakRequired = [2, 3, 4, 5, 0];

  // Color schemes for each box
  const boxColors = [
    "bg-red-800 border-red-700 hover:bg-red-700",
    "bg-orange-800 border-orange-700 hover:bg-orange-700",
    "bg-yellow-800 border-yellow-700 hover:bg-yellow-700",
    "bg-blue-800 border-blue-700 hover:bg-blue-700",
    "bg-green-800 border-green-700 hover:bg-green-700"
  ];

  // Progress bar colors
  const progressColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500", 
    "bg-blue-500",
    "bg-green-500"
  ];

  return (
    <Card 
      className={cn(
        "flex flex-col justify-between p-3 cursor-pointer transition-all border",
        boxColors[boxNumber - 1],
        isActive ? "ring-2 ring-loklernen-ultramarine ring-offset-2 ring-offset-black" : "",
      )}
      onClick={onClick}
      data-testid={`learning-box-${boxNumber}`}
    >
      <div className="mb-2">
        <div className="text-sm font-bold mb-1 text-white">Box {boxNumber}</div>
        <div className="text-xs text-gray-300">{boxNames[boxNumber - 1]}</div>
      </div>
      
      <div className="flex flex-col gap-1">
        {/* Box progress */}
        <div className="flex flex-row items-center justify-between gap-2">
          <Progress 
            value={(totalCards > 0 ? (totalCards - dueCards) / totalCards * 100 : 0)} 
            className={cn("h-2", progressColors[boxNumber - 1])}
          />
          <span className="text-xs text-gray-300 whitespace-nowrap">
            {dueCards}/{totalCards}
          </span>
        </div>
        
        {/* Info about required streak */}
        {boxNumber < 5 && (
          <div className="text-[10px] text-gray-300 text-center">
            {streakRequired[boxNumber - 1]}x richtig für nächste Box
          </div>
        )}
      </div>
    </Card>
  );
}
