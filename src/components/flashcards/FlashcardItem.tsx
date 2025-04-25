import React, { useState, useEffect } from "react";
import { Question } from "@/types/questions";
import { Lightbulb, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashcardItemProps {
  question: Question;
  onAnswer: (score: number) => void;
  onNext: () => void;
  showAnswer?: boolean;
}

export default function FlashcardItem({ 
  question, 
  onAnswer, 
  onNext,
  showAnswer = false
}: FlashcardItemProps) {
  const [flipped, setFlipped] = useState(showAnswer);
  const [answered, setAnswered] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setFlipped(showAnswer);
    setAnswered(false);
  }, [question, showAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flipped && !answered) {
        if (e.key === "1") handleConfidenceRating(1);
        else if (e.key === "2") handleConfidenceRating(2);
        else if (e.key === "3") handleConfidenceRating(4);
        else if (e.key === "4") handleConfidenceRating(5);
      } else if (!flipped) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleShowAnswer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipped, answered, question]);

  const handleShowAnswer = () => {
    setFlipped(true);
  };
  
  const handleConfidenceRating = (score: number) => {
    setAnswered(true);
    onAnswer(score);
    onNext();
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className={`relative p-4 ${isMobile ? 'min-h-[400px]' : 'min-h-[450px]'} flex flex-col`}>
        {!flipped ? (
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-medium mb-3">{question?.text}</h2>
            <div className="flex-1 flex items-center justify-center py-4">
              {question?.image_url && (
                <img 
                  src={question.image_url} 
                  alt="Signal" 
                  className="max-h-[200px] max-w-full object-contain"
                />
              )}
            </div>
            <div className="mt-4">
              <Button 
                className="w-full"
                onClick={handleShowAnswer}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Signal anzeigen
              </Button>
              <div className="text-xs text-gray-400 text-center mt-2">
                Drücke die Leertaste, um die Antwort anzuzeigen
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="mb-3">
              <h2 className="text-lg font-medium">Antwort</h2>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-between gap-4">
              <div className="flex flex-col items-center w-full">
                {question?.image_url && (
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="max-h-[140px] object-contain mb-4"
                  />
                )}
                
                <div className="bg-blue-50 p-4 rounded-md w-full">
                  {question.category === "Signale" ? (
                    <div className="space-y-2">
                      {question.answers[0].text.split('\n').map((line, i) => (
                        <p key={i} className="font-bold text-blue-800">
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="font-medium text-lg text-blue-800">
                      {question?.answers[0].text}
                    </p>
                  )}
                </div>
              </div>

              {!answered && (
                <div className="w-full grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="h-20 border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 flex flex-col gap-1"
                    onClick={() => handleConfidenceRating(1)}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span>Ratlos</span>
                    <span className="text-xs opacity-70">(1)</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 border-2 border-red-200 bg-red-50/50 text-red-600 hover:bg-red-100 hover:border-red-300 flex flex-col gap-1"
                    onClick={() => handleConfidenceRating(2)}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span>Unsicher</span>
                    <span className="text-xs opacity-70">(2)</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 border-2 border-green-200 bg-green-50/50 text-green-600 hover:bg-green-100 hover:border-green-300 flex flex-col gap-1"
                    onClick={() => handleConfidenceRating(4)}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>Sicher</span>
                    <span className="text-xs opacity-70">(3)</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 border-2 border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400 flex flex-col gap-1"
                    onClick={() => handleConfidenceRating(5)}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>Gewusst</span>
                    <span className="text-xs opacity-70">(4)</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
