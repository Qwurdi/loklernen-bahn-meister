
import React, { useState, useRef } from "react";
import { Question } from "@/types/questions";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FlashcardActionButton from "./FlashcardActionButton";

interface FlashcardItemMobileProps {
  question: Question;
  flipped: boolean;
  answered: boolean;
  onShowAnswer: () => void;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function FlashcardItemMobile({ 
  question, 
  flipped, 
  answered,
  onShowAnswer,
  onKnown,
  onNotKnown
}: FlashcardItemMobileProps) {
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
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
      // Swipe right = known
      onKnown();
    } else if (dragDelta < -threshold) {
      // Swipe left = not known
      onNotKnown();
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
              onClick={onShowAnswer}
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
                <FlashcardActionButton
                  variant="unknown"
                  onClick={onNotKnown}
                  isMobile={true}
                />
                <FlashcardActionButton
                  variant="known"
                  onClick={onKnown}
                  isMobile={true}
                />
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
