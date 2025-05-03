
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

  // Get box color based on boxNumber
  const getBoxAccentColor = () => {
    switch (boxNumber) {
      case 1: return "border-loklernen-coral/30 bg-loklernen-coral/10";
      case 2: return "border-amber-500/30 bg-amber-500/10";
      case 3: return "border-loklernen-lavender/30 bg-loklernen-lavender/10";
      case 4: return "border-loklernen-tranquil/30 bg-loklernen-tranquil/10";
      case 5: return "border-loklernen-mint/30 bg-loklernen-mint/10";
      default: return "border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <Card className="glass-card border-gray-700/50 p-5 rounded-xl shadow-lg">
      <div className={`rounded-lg ${getBoxAccentColor()} p-3 mb-4 backdrop-blur-sm`}>
        <h3 className="text-lg font-bold mb-1 text-white">Box {boxNumber}</h3>
        <p className="text-sm text-gray-300">{boxDescriptions[boxNumber - 1]}</p>
      </div>
      
      {dueCount > 0 ? (
        <Button 
          onClick={onStartLearning}
          className="w-full bg-gradient-ultramarine hover:opacity-90 shadow-md mb-5 transition-all duration-300 hover:-translate-y-1"
        >
          {dueCount} fällige Karten lernen <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      ) : (
        <div className="text-center p-3 mb-5 glass-card rounded-lg text-sm text-gray-300 border border-gray-700/50">
          Keine fälligen Karten in dieser Box
        </div>
      )}
      
      {previewQuestions.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white bg-gradient-lavender bg-clip-text text-transparent">Kartenvorschau:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {previewQuestions.map(question => (
              <Card 
                key={question.id}
                className="glass-card border-gray-700/50 p-3 h-[120px] overflow-hidden hover:border-loklernen-ultramarine/50 cursor-pointer transition-all duration-300 group"
                onClick={() => navigate(`/karteikarten/lernen?box=${boxNumber}`)}
              >
                {question.image_url ? (
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="relative p-1 rounded-md overflow-hidden bg-black/20 backdrop-blur-sm">
                      <img 
                        src={question.image_url} 
                        alt="Signalbild" 
                        className="max-h-full max-w-full object-contain rounded"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-loklernen-ultramarine/10 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <p className="text-xs text-gray-300 line-clamp-4 mb-2">{question.text}</p>
                    <div className="mt-auto text-[10px] text-right text-loklernen-ultramarine">Karte ansehen →</div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-5 glass-card rounded-lg">
          <p className="text-gray-400">Noch keine Karten in dieser Box</p>
        </div>
      )}
    </Card>
  );
}
