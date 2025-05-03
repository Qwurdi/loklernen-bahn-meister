
import React from 'react';
import { Question } from '@/types/questions';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BoxContentViewProps {
  boxNumber: number;
  questions: Question[];
  dueCount: number;
  onStartLearning: () => void;
}

export default function BoxContentView({
  boxNumber,
  questions,
  dueCount,
  onStartLearning
}: BoxContentViewProps) {
  const navigate = useNavigate();

  // Select max 3 questions to preview
  const previewQuestions = questions.slice(0, 3);
  
  // Box descriptions for the UI
  const boxDescriptions = [
    "Diese Karten sind neu oder schwierig für dich. Sie werden täglich wiederholt.",
    "Diese Karten kennst du schon ein bisschen. Sie werden alle 3 Tage wiederholt.",
    "Diese Karten beherrschst du gut. Sie werden wöchentlich wiederholt.",
    "Diese Karten hast du fast gemeistert. Sie werden alle zwei Wochen wiederholt.",
    "Diese Karten hast du gemeistert. Sie werden monatlich wiederholt."
  ];

  return (
    <Card className="bg-gray-900 border-gray-800 p-4">
      <h3 className="text-lg font-bold mb-2">Box {boxNumber}</h3>
      <p className="text-sm text-gray-400 mb-4">{boxDescriptions[boxNumber - 1]}</p>
      
      {dueCount > 0 ? (
        <Button 
          onClick={onStartLearning}
          className="w-full bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90 mb-4"
        >
          {dueCount} fällige Karten lernen <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      ) : (
        <div className="text-center p-2 mb-4 bg-gray-800 rounded-md text-sm">
          Keine fälligen Karten in dieser Box
        </div>
      )}
      
      {previewQuestions.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Kartenvorschau:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {previewQuestions.map(question => (
              <Card 
                key={question.id}
                className="bg-gray-800 border-gray-700 p-2 h-[100px] overflow-hidden hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/karteikarten/lernen?box=${boxNumber}`)}
              >
                {question.image_url ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src={question.image_url} 
                      alt="Signalbild" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-gray-300 line-clamp-3">{question.text}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-800 rounded-md">
          <p className="text-gray-400">Noch keine Karten in dieser Box</p>
        </div>
      )}
    </Card>
  );
}
