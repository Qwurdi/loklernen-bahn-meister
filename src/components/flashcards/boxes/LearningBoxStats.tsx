
import React from 'react';
import { BookOpen, Clock } from 'lucide-react';

interface LearningBoxStatsProps {
  totalCards: number;
  dueToday: number;
}

export default function LearningBoxStats({ totalCards, dueToday }: LearningBoxStatsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm text-gray-400 border-t border-gray-700 pt-3">
      <div className="flex items-center gap-1">
        <BookOpen className="h-4 w-4" />
        <span>{totalCards} Karten insgesamt</span>
      </div>
      
      <div className="flex items-center gap-1 mt-2 sm:mt-0">
        <Clock className="h-4 w-4" />
        <span className="text-loklernen-ultramarine font-medium">{dueToday} Karten heute fällig</span>
      </div>
    </div>
  );
}
