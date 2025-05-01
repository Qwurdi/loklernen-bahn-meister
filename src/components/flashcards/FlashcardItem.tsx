
import React, { useState, useEffect, useRef } from "react";
import { Question } from "@/types/questions";
import { Lightbulb, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toggle } from "@/components/ui/toggle";

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
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Reset state when question changes
  useEffect(() => {
    setFlipped(showAnswer);
    setAnswered(false);
    setDragDelta(0);
  }, [question, showAnswer]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flipped && !answered) {
        if (e.key === "ArrowLeft" || e.key === "n" || e.key === "N") {
          handleNotKnown();
        } else if (e.key === "ArrowRight" || e.key === "y" || e.key === "Y") {
          handleKnown();
        }
      } else if (!flipped) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleShowAnswer();
        }
      }
    };

    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [flipped, answered, question, isMobile]);

  const handleShowAnswer = () => {
    setFlipped(true);
  };
  
  const handleKnown = () => {
    setAnswered(true);
    onAnswer(5); // Score 5 for "Gewusst"
    
    // Small delay to see the selection before moving on
    setTimeout(() => {
      onNext();
    }, 300);
  };
  
  const handleNotKnown = () => {
    setAnswered(true);
    onAnswer(1); // Score 1 for "Nicht gewusst" (resets the card)
    
    // Small delay to see the selection before moving on
    setTimeout(() => {
      onNext();
    }, 300);
  };
  
  // Touch handling for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!flipped || answered) return;
    setDragStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null || !flipped || answered) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - dragStartX;
    setDragDelta(delta);
  };
  
  const handleTouchEnd = () => {
    if (dragStartX === null || !flipped || answered) return;
    
    // Threshold for swipe action (px)
    const threshold = 80; 
    
    if (dragDelta > threshold) {
      // Swipe right = known (5)
      handleKnown();
    } else if (dragDelta < -threshold) {
      // Swipe left = not known (1)
      handleNotKnown();
    }
    
    // Reset
    setDragStartX(null);
    setDragDelta(0);
  };

  // Prepare card rotation style based on drag
  const cardStyle = dragDelta !== 0 
    ? { 
        transform: `rotate(${dragDelta * 0.05}deg)`,
        backgroundColor: dragDelta > 30 ? 'rgba(209, 250, 229, 0.8)' : 
                         dragDelta < -30 ? 'rgba(254, 226, 226, 0.8)' : undefined,
        transition: 'transform 0.1s ease-out, background-color 0.2s ease'
      }
    : {};

  // Mobile component with subtle floating action buttons
  if (isMobile) {
    return (
      <div className="mx-auto w-full relative">
        <Card 
          ref={cardRef}
          className="relative p-4 min-h-[calc(100vh-230px)] flex flex-col bg-white rounded-xl shadow-md"
          style={cardStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {!flipped ? (
            <div className="flex flex-col h-full">
              <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-500 self-start mb-2">Signal</div>
              <h2 className="text-lg font-medium mb-4">{question?.text}</h2>
              <div className="flex-1 flex items-center justify-center py-8">
                {question?.image_url && (
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="max-h-[240px] max-w-full object-contain"
                  />
                )}
              </div>
              <Button 
                className="w-full py-6 mt-auto bg-loklernen-sapphire text-white hover:bg-loklernen-sapphire/90"
                onClick={handleShowAnswer}
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                Signal anzeigen
              </Button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-2">Antwort</div>
              
              <div className="flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col items-center w-full pb-16"> {/* Add padding to make room for buttons */}
                  {question?.image_url && (
                    <img 
                      src={question.image_url} 
                      alt="Signal" 
                      className="max-h-[160px] object-contain mb-6"
                    />
                  )}
                  
                  <div className="bg-blue-50 p-5 rounded-xl w-full shadow-sm border border-blue-100 mb-8">
                    {question.category === "Signale" ? (
                      <div className="space-y-3">
                        {question.answers[0].text.split('\n').map((line, i) => (
                          <p key={i} className="font-bold text-lg text-blue-800">
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
              </div>
              
              {/* Subtle floating action buttons */}
              {!answered && (
                <div className="absolute left-0 right-0 bottom-4 flex justify-center items-center space-x-6">
                  <div className="text-xs text-gray-500 absolute -top-5 w-full text-center">
                    Nach links wischen = Nicht gewusst | Nach rechts = Gewusst
                  </div>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-white/80 border-red-200 hover:bg-red-50 shadow-sm hover:border-red-300 backdrop-blur-sm"
                    onClick={handleNotKnown}
                    aria-label="Nicht gewusst"
                  >
                    <X className="h-5 w-5 text-red-500" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-white/80 border-green-200 hover:bg-green-50 shadow-sm hover:border-green-300 backdrop-blur-sm"
                    onClick={handleKnown}
                    aria-label="Gewusst"
                  >
                    <Check className="h-5 w-5 text-green-500" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Swipe hint overlay */}
        {flipped && dragDelta !== 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div 
              className={`text-4xl font-bold transition-opacity ${
                Math.abs(dragDelta) < 40 ? 'opacity-0' : 'opacity-70'
              } ${
                dragDelta > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {dragDelta > 0 ? 'Gewusst' : 'Nicht gewusst'}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version with subtle buttons
  return (
    <div className="mx-auto max-w-md">
      <Card className="relative p-4 min-h-[450px] flex flex-col">
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
                
                <div className="bg-blue-50 p-4 rounded-md w-full shadow-sm border border-blue-100 mb-8">
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
                <div className="w-full flex flex-row gap-4 justify-center mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300 h-12"
                    onClick={handleNotKnown}
                  >
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    Nicht gewusst
                  </Button>
                  <Button
                    variant="outline" 
                    className="flex-1 border-green-200 hover:bg-green-50 hover:border-green-300 h-12"
                    onClick={handleKnown}
                  >
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Gewusst
                  </Button>
                </div>
              )}
              
              <div className="text-xs text-gray-400 text-center w-full mt-1">
                Tastatur: ← Nicht gewusst | → Gewusst
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
