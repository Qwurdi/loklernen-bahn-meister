
import React from 'react';

interface LearningBoxStatsProps {
  totalCards: number;
  dueToday: number;
}

export default function LearningBoxStats({ totalCards, dueToday }: LearningBoxStatsProps) {
  return (
    <div className="flex items-center justify-between px-1 py-2 text-sm">
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 bg-loklernen-ultramarine rounded-full"></div>
        <span className="text-xs text-gray-300">Gesamt: <span className="font-medium text-white">{totalCards}</span> Karten</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 bg-loklernen-coral rounded-full"></div>
        <span className="text-xs text-gray-300">Heute fällig: <span className="font-medium text-white">{dueToday}</span></span>
      </div>
    </div>
  );
}
