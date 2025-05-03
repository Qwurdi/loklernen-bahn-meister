
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { transformAnswers } from '@/api/questions';
import { Question } from '@/types/questions';

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
    <div className="space-y-3">
      {Object.entries(groupedCards).map(([category, subcategories]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-white">{category}</h4>
          
          {Object.entries(subcategories).map(([subcategory, cards]) => (
            <div key={subcategory} className="space-y-1">
              <h5 className="text-xs text-gray-400">{subcategory} ({cards.length})</h5>
              
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2 pb-2">
                  {cards.map(card => {
                    // Transform question data to match our Question type
                    const question: Question = {
                      ...card.questions,
                      answers: transformAnswers(card.questions.answers)
                    };

                    return (
                      <Link 
                        key={card.id} 
                        to={`/karteikarten/lernen?questionId=${card.question_id}`} 
                        className="inline-block"
                      >
                        <Card 
                          className={`w-36 h-24 transition-all ${
                            hoverCard === card.id ? 'ring-2 ring-loklernen-ultramarine' : ''
                          }`}
                          onMouseEnter={() => setHoverCard(card.id)}
                          onMouseLeave={() => setHoverCard(null)}
                        >
                          <CardContent className="p-2 overflow-hidden h-full flex flex-col">
                            {question.image_url && (
                              <div 
                                className="h-10 bg-center bg-cover bg-no-repeat rounded mb-1" 
                                style={{ backgroundImage: `url(${question.image_url})` }}
                              />
                            )}
                            <div className="text-xs line-clamp-3 overflow-hidden">
                              {question.text}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
