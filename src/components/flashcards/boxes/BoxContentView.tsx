
import React from 'react';
import { Question } from '@/types/questions';
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
  
  // Get box accent color based on boxNumber
  const getBoxAccentStyle = () => {
    switch (boxNumber) {
      case 1:
        return "bg-gradient-to-r from-loklernen-coral/10 to-white border-l-4 border-loklernen-coral";
      case 2:
        return "bg-gradient-to-r from-amber-500/10 to-white border-l-4 border-amber-500";
      case 3:
        return "bg-gradient-to-r from-loklernen-tranquil/10 to-white border-l-4 border-loklernen-tranquil";
      case 4:
        return "bg-gradient-to-r from-blue-400/10 to-white border-l-4 border-blue-400";
      case 5:
        return "bg-gradient-to-r from-loklernen-mint/10 to-white border-l-4 border-loklernen-mint";
      default:
        return "bg-gradient-to-r from-gray-500/10 to-white border-l-4 border-gray-500";
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div className={`rounded-lg p-3 ${getBoxAccentStyle()}`}>
        <h3 className="text-lg font-bold mb-1 text-gray-800">Box {boxNumber}</h3>
        <p className="text-sm text-gray-600">{boxDescriptions[boxNumber - 1]}</p>
      </div>
      
      {dueCount > 0 ? (
        <Button 
          onClick={onStartLearning}
          className="w-full bg-gradient-ultramarine hover:opacity-90 shadow-sm mb-5 transition-all duration-300 hover:-translate-y-1"
        >
          {dueCount} fällige Karten lernen <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      ) : (
        <div className="text-center p-3 mb-5 bg-gray-50 rounded-lg text-sm text-gray-500 border border-gray-200">
          Keine fälligen Karten in dieser Box
        </div>
      )}
      
      {previewQuestions.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Kartenvorschau:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {previewQuestions.map(question => (
              <div 
                key={question.id}
                className="border border-gray-200 p-3 h-[120px] overflow-hidden hover:border-loklernen-ultramarine/50 cursor-pointer transition-all duration-300 group bg-white rounded-lg shadow-sm hover:shadow-md"
                onClick={() => navigate(`/karteikarten/lernen?box=${boxNumber}`)}
              >
                {question.image_url ? (
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="relative p-1 rounded-md overflow-hidden">
                      <img 
                        src={question.image_url} 
                        alt="Signalbild" 
                        className="max-h-full max-w-full object-contain rounded"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-loklernen-ultramarine/5 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <p className="text-xs text-gray-600 line-clamp-4 mb-2">{question.text}</p>
                    <div className="mt-auto text-[10px] text-right text-loklernen-ultramarine group-hover:text-loklernen-ultramarine/80">Karte ansehen →</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-5 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Noch keine Karten in dieser Box</p>
        </div>
      )}
    </div>
  );
}
