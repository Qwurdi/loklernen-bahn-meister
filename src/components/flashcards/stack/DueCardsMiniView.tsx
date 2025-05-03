
import React, { useState } from 'react';
import DueCardCategory from './DueCardCategory';

type DueCard = {
  questions: any;
  id: string;
  question_id: string;
  interval_days: number;
};

interface DueCardsMiniViewProps {
  dueCards: DueCard[];
}

export default function DueCardsMiniView({ dueCards }: DueCardsMiniViewProps) {
  const [hoverCard, setHoverCard] = useState<string | null>(null);
  
  // Group cards by category and subcategory
  const groupedCards: Record<string, Record<string, DueCard[]>> = {};
  
  dueCards.forEach(card => {
    if (!card.questions) return;
    
    const category = card.questions.category;
    const subcategory = card.questions.sub_category;
    
    if (!groupedCards[category]) {
      groupedCards[category] = {};
    }
    
    if (!groupedCards[category][subcategory]) {
      groupedCards[category][subcategory] = [];
    }
    
    groupedCards[category][subcategory].push(card);
  });

  if (dueCards.length === 0) {
    return (
      <div className="text-center py-3 text-gray-400 text-sm">
        Keine Karten fällig zum Lernen
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedCards).map(([category, subcategories]) => (
        <DueCardCategory
          key={category}
          category={category}
          subcategories={subcategories}
          hoverCard={hoverCard}
          onHoverCard={setHoverCard}
        />
      ))}
    </div>
  );
}
