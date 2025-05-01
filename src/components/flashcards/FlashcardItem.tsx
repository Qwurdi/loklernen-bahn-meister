
import React, { useState, useEffect } from "react";
import { Question } from "@/types/questions";
import { Lightbulb, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"known" | "unknown" | null>(null);
  const isMobile = useIsMobile();

  // Reset states when question changes
  useEffect(() => {
    setFlipped(showAnswer);
    setAnswered(false);
    setShowFeedback(false);
    setSelectedOption(null);
  }, [question, showAnswer]);

  // Delayed feedback appearance
  useEffect(() => {
    let timer: number | undefined;
    
    if (flipped && !showFeedback) {
      timer = window.setTimeout(() => {
        setShowFeedback(true);
      }, 2500); // Show feedback options after 2.5 seconds
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [flipped]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flipped && showFeedback) {
        if (!selectedOption) {
          // First stage - Known/Unknown
          if (e.key === "1") handleInitialSelection("unknown");
          else if (e.key === "2") handleInitialSelection("known");
        } else {
          // Second stage - Confidence rating
          if (selectedOption === "unknown") {
            if (e.key === "1") handleConfidenceRating(1);
            else if (e.key === "2") handleConfidenceRating(2);
          } else if (selectedOption === "known") {
            if (e.key === "1") handleConfidenceRating(4);
            else if (e.key === "2") handleConfidenceRating(5);
          }
        }
      } else if (!flipped) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleShowAnswer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipped, showFeedback, selectedOption]);

  const handleShowAnswer = () => {
    setFlipped(true);
  };
  
  const handleInitialSelection = (option: "known" | "unknown") => {
    setSelectedOption(option);
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
            
            {/* Focus area for answer content */}
            <div 
              className={cn(
                "flex-1 flex flex-col items-center justify-between gap-4 transition-all duration-300",
                !showFeedback && "animate-pulse-subtle"
              )}
            >
              <div className={cn(
                "flex flex-col items-center w-full transition-all duration-300",
                !showFeedback && "scale-105"
              )}>
                {question?.image_url && (
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="max-h-[140px] object-contain mb-4"
                  />
                )}
                
                <div className={cn(
                  "w-full p-4 rounded-md transition-all duration-300",
                  !showFeedback 
                    ? "bg-blue-100 ring-2 ring-blue-300 shadow-lg" 
                    : "bg-blue-50"
                )}>
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

              {/* Two-stage feedback system */}
              {!answered && showFeedback && (
                <div className="w-full space-y-4 animate-fade-in">
                  {/* Stage 1: Known or Unknown */}
                  {!selectedOption && (
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline"
                        className="h-16 border text-red-700 hover:bg-red-50 hover:text-red-800 flex flex-col gap-1"
                        onClick={() => handleInitialSelection("unknown")}
                      >
                        <X className="h-5 w-5" />
                        <span>Nicht gewusst</span>
                        <span className="text-xs opacity-70">(1)</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-16 border text-green-700 hover:bg-green-50 hover:text-green-800 flex flex-col gap-1"
                        onClick={() => handleInitialSelection("known")}
                      >
                        <Check className="h-5 w-5" />
                        <span>Gewusst</span>
                        <span className="text-xs opacity-70">(2)</span>
                      </Button>
                    </div>
                  )}
                  
                  {/* Stage 2: Confidence levels */}
                  {selectedOption === "unknown" && (
                    <>
                      <Badge variant="outline" className="bg-red-50 text-red-700 mb-1 mx-auto">Wie unsicher?</Badge>
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          variant="outline"
                          className="h-16 border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 flex flex-col gap-1"
                          onClick={() => handleConfidenceRating(1)}
                        >
                          <span>Komplett ratlos</span>
                          <span className="text-xs opacity-70">(1)</span>
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-16 border-2 border-red-200 bg-red-50/50 text-red-600 hover:bg-red-100 hover:border-red-300 flex flex-col gap-1"
                          onClick={() => handleConfidenceRating(2)}
                        >
                          <span>Etwas unsicher</span>
                          <span className="text-xs opacity-70">(2)</span>
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {selectedOption === "known" && (
                    <>
                      <Badge variant="outline" className="bg-green-50 text-green-700 mb-1 mx-auto">Wie sicher?</Badge>
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          variant="outline"
                          className="h-16 border-2 border-green-200 bg-green-50/50 text-green-600 hover:bg-green-100 hover:border-green-300 flex flex-col gap-1"
                          onClick={() => handleConfidenceRating(4)}
                        >
                          <span>Etwas sicher</span>
                          <span className="text-xs opacity-70">(1)</span>
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-16 border-2 border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400 flex flex-col gap-1"
                          onClick={() => handleConfidenceRating(5)}
                        >
                          <span>Sehr sicher</span>
                          <span className="text-xs opacity-70">(2)</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
