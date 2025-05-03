
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { transformAnswers } from '@/api/questions';
import { Question } from '@/types/questions';
import { Badge } from '@/components/ui/badge';
import { Clock, Signal } from 'lucide-react';

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
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-white">
              {category === "Signale" ? (
                <Signal className="h-4 w-4 inline mr-1 text-loklernen-ultramarine" />
              ) : (
                <span className="inline-block w-4 h-4 bg-loklernen-betriebsdienst rounded-sm mr-1"></span>
              )}
              {category}
            </h4>
          </div>
          
          {Object.entries(subcategories).map(([subcategory, cards]) => (
            <div key={subcategory} className="space-y-2 pl-1 border-l-2 border-gray-800">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-medium text-gray-300">{subcategory}</h5>
                <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300">
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
                      <Link 
                        key={card.id} 
                        to={`/karteikarten/lernen?questionId=${card.question_id}`} 
                        className="shrink-0"
                      >
                        <Card 
                          className={`w-36 h-24 transition-all ${
                            hoverCard === card.id ? 
                            'border-loklernen-ultramarine shadow-md shadow-loklernen-ultramarine/20' : 
                            'border-gray-800'
                          } dark-card`}
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
                            <div className="text-xs line-clamp-2 overflow-hidden">
                              {question.text}
                            </div>
                            <div className="mt-auto pt-1 text-[10px] text-gray-400">
                              {question.regulation_category || "Allgemein"}
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
