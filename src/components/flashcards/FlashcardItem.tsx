
import React, { useState, useEffect, useRef } from "react";
import { Question } from "@/types/questions";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Reset state when question changes
  useEffect(() => {
    setFlipped(showAnswer);
    setAnswered(false);
    setDragDelta(0);
    setSheetOpen(false);
    setDrawerOpen(false);
  }, [question, showAnswer]);

  // Handle keyboard shortcuts
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

    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [flipped, answered, question, isMobile]);

  const handleShowAnswer = () => {
    setFlipped(true);
  };
  
  const handleConfidenceRating = (score: number) => {
    setAnswered(true);
    onAnswer(score);
    
    // On mobile, close the sheet/drawer after rating
    if (isMobile) {
      setSheetOpen(false);
      setDrawerOpen(false);
    }
    
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
    const threshold = 100; 
    
    if (dragDelta > threshold) {
      // Swipe right = confident (4)
      handleConfidenceRating(4);
    } else if (dragDelta < -threshold) {
      // Swipe left = unsure (2)
      handleConfidenceRating(2);
    }
    
    // Reset
    setDragStartX(null);
    setDragDelta(0);
  };

  // Prepare card rotation style based on drag
  const cardStyle = dragDelta !== 0 
    ? { 
        transform: `rotate(${dragDelta * 0.05}deg)`,
        backgroundColor: dragDelta > 50 ? 'rgba(209, 250, 229, 0.8)' : 
                         dragDelta < -50 ? 'rgba(254, 226, 226, 0.8)' : undefined,
        transition: 'transform 0.1s ease-out, background-color 0.2s ease'
      }
    : {};

  const renderRatingButtons = () => {
    const buttonClasses = isMobile ? "flex flex-row items-center gap-2 px-4 py-6 border-b border-gray-100 hover:bg-gray-50 w-full justify-between" : "flex-1 py-2 px-2 text-xs border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300";
    
    return (
      <>
        <Button 
          variant="ghost"
          className={buttonClasses}
          onClick={() => handleConfidenceRating(1)}
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={isMobile ? "bg-gray-100 h-8 w-8 flex items-center justify-center p-0" : "ml-1 text-[10px] bg-gray-100"}>1</Badge>
            <span className={isMobile ? "text-base" : ""}>Ratlos</span>
          </div>
          {isMobile && <span className="text-xs text-gray-400">Karte zurücksetzen</span>}
        </Button>
        
        <Button 
          variant="ghost"
          className={buttonClasses}
          onClick={() => handleConfidenceRating(2)}
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={isMobile ? "bg-gray-100 h-8 w-8 flex items-center justify-center p-0" : "ml-1 text-[10px] bg-gray-100"}>2</Badge>
            <span className={isMobile ? "text-base" : ""}>Unsicher</span>
          </div>
          {isMobile && <span className="text-xs text-gray-400">Bald wiederholen</span>}
        </Button>
        
        <Button 
          variant="ghost"
          className={buttonClasses}
          onClick={() => handleConfidenceRating(4)}
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={isMobile ? "bg-blue-50 h-8 w-8 flex items-center justify-center p-0" : "ml-1 text-[10px] bg-blue-50"}>3</Badge>
            <span className={isMobile ? "text-base" : ""}>Sicher</span>
          </div>
          {isMobile && <span className="text-xs text-gray-400">Größeres Intervall</span>}
        </Button>
        
        <Button 
          variant="ghost"
          className={buttonClasses}
          onClick={() => handleConfidenceRating(5)}
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={isMobile ? "bg-indigo-50 h-8 w-8 flex items-center justify-center p-0" : "ml-1 text-[10px] bg-indigo-50"}>4</Badge>
            <span className={isMobile ? "text-base" : ""}>Gewusst</span>
          </div>
          {isMobile && <span className="text-xs text-gray-400">Längeres Intervall</span>}
        </Button>
      </>
    );
  };

  // Mobile component with bottom drawer
  if (isMobile) {
    return (
      <div className="mx-auto w-full">
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
                <div className="flex flex-col items-center w-full">
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

                {!answered && (
                  <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button 
                        className="w-full mt-auto py-6 bg-gradient-to-r from-loklernen-sapphire to-loklernen-ultramarine text-white"
                        onClick={() => setDrawerOpen(true)}
                      >
                        Bewerten
                        <ChevronUp className="h-4 w-4 ml-2" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="px-0 pt-0 pb-8">
                      <div className="flex flex-col space-y-0 divide-y">
                        <div className="px-4 pt-4 pb-2">
                          <h3 className="text-lg font-medium">Wie gut wusstest du es?</h3>
                          <p className="text-sm text-gray-500 mt-1">Wische nach rechts für "Sicher" oder links für "Unsicher"</p>
                        </div>
                        {renderRatingButtons()}
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            </div>
          )}
        </Card>

        {flipped && dragDelta !== 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div 
              className={`text-4xl font-bold transition-opacity ${
                Math.abs(dragDelta) < 50 ? 'opacity-0' : 'opacity-70'
              } ${
                dragDelta > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {dragDelta > 0 ? 'Gewusst' : 'Unsicher'}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
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
                <div className="w-full flex flex-row gap-2 justify-center items-center mt-auto">
                  {renderRatingButtons()}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
