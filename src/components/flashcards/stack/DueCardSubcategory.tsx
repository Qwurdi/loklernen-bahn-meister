
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { transformAnswers } from '@/api/questions';
import { Question } from '@/types/questions';
import DueCardItem from './DueCardItem';

interface DueCardSubcategoryProps {
  subcategory: string;
  cards: any[];
  hoverCard: string | null;
  onHoverCard: (id: string | null) => void;
}

export default function DueCardSubcategory({ 
  subcategory, 
  cards, 
  hoverCard, 
  onHoverCard 
}: DueCardSubcategoryProps) {
  return (
    <div className="space-y-2 pl-1 border-l-2 border-gray-700">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-medium text-gray-300">{subcategory}</h5>
        <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-700">
          <Clock className="h-3 w-3 mr-1" /> {cards.length}
        </Badge>
      </div>
      
      <ScrollArea className="w-full pb-2">
        <div className="flex gap-2 pb-1">
          {cards.map(card => {
            // Transform question data to match our Question type
            const question: Question = {
              ...card.questions,
              answers: transformAnswers(card.questions.answers)
            };

            return (
              <DueCardItem 
                key={card.id}
                card={card}
                question={question}
                isHovered={hoverCard === card.id}
                onMouseEnter={() => onHoverCard(card.id)}
                onMouseLeave={() => onHoverCard(null)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
