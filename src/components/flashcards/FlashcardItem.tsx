
import React, { useState, useEffect } from "react";
import { Question } from "@/types/questions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Check, X } from "lucide-react";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";
import ZoomableImage from "@/components/common/ZoomableImage";
import MultipleChoiceQuestion from "./MultipleChoice";
import HintButton from "./HintButton";
import { useCardSwipe } from "./mobile/swipe/useCardSwipe";
import SwipeIndicator from "./mobile/SwipeIndicator";

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
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";

  // Swipe functionality for mobile
  const { 
    cardRef, 
    swipeState, 
    handlers, 
    getCardStyle, 
    getCardClasses 
  } = useCardSwipe({
    onSwipeLeft: () => handleAnswer(1),
    onSwipeRight: () => handleAnswer(5),
    onShowAnswer: handleShowAnswer,
    isFlipped: flipped,
    isAnswered: answered,
    disableSwipe: !isMobile || !flipped || isMultipleChoice
  });

  // Dynamic text sizing
  const questionTextClass = useDynamicTextSize(question.text, 'question');
  const answerTextClass = useDynamicTextSize(
    question?.answers?.[0]?.text || '', 
    'answer'
  );

  // Reset state when question changes
  useEffect(() => {
    setFlipped(showAnswer);
    setAnswered(false);
  }, [question, showAnswer]);

  // Keyboard shortcuts for desktop
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (flipped && !answered) {
        if (e.key === "ArrowLeft" || e.key === "n" || e.key === "N") {
          handleAnswer(1);
        } else if (e.key === "ArrowRight" || e.key === "y" || e.key === "Y") {
          handleAnswer(5);
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
  }, [flipped, answered, question, isMobile]);

  function handleShowAnswer() {
    setFlipped(true);
  }
  
  function handleAnswer(score: number) {
    setAnswered(true);
    onAnswer(score);
    
    setTimeout(() => {
      onNext();
    }, 300);
  }

  function handleMCAnswer(isCorrect: boolean) {
    handleAnswer(isCorrect ? 5 : 1);
  }

  const cardClasses = `relative ${isMobile ? 'w-full h-full' : 'max-w-md mx-auto'} ${
    isMobile ? 'min-h-[500px]' : 'min-h-[500px]'
  } ${getCardClasses ? getCardClasses() : ''}`;

  const cardStyle = getCardStyle ? getCardStyle() : {};

  return (
    <div className={isMobile ? "h-full w-full px-3 touch-none" : "mx-auto max-w-md"}>
      <Card 
        ref={cardRef}
        className={cardClasses}
        style={cardStyle}
        onClick={!flipped && !isMobile ? handleShowAnswer : (!flipped && isMobile ? handleShowAnswer : undefined)}
        onTouchStart={isMobile && flipped ? handlers.handleTouchStart : undefined}
        onTouchMove={isMobile && flipped ? handlers.handleTouchMove : undefined}
        onTouchEnd={isMobile && flipped ? handlers.handleTouchEnd : undefined}
      >
        <div className="p-4 h-full flex flex-col">
          {!flipped ? (
            // Question Side
            <>
              <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
                {isMultipleChoice ? "Multiple Choice" : question.sub_category}
              </div>
              
              <div className={`${questionTextClass} font-medium mb-4 text-gray-900`}>
                <SafeRichText content={question.text} />
              </div>
              
              {question.image_url && (
                <div className="flex-1 flex items-center justify-center mb-4">
                  {isMobile ? (
                    <img 
                      src={question.image_url} 
                      alt="Question" 
                      className="max-h-full object-contain rounded-md"
                    />
                  ) : (
                    <ZoomableImage
                      src={question.image_url}
                      alt="Signal"
                      containerClassName="w-full max-w-[200px]" 
                    />
                  )}
                </div>
              )}
              
              <div className="mb-3">
                <HintButton 
                  hint={question.hint}
                  question={question.text}
                  answers={question.answers}
                  minimal={isMobile}
                />
              </div>
              
              {isMobile && (
                <div className="text-xs text-gray-500 text-center mb-2">
                  Tippe auf die Karte oder den Button, um die Antwort zu sehen
                </div>
              )}
              
              <Button 
                className="w-full bg-gradient-to-r from-loklernen-ultramarine to-blue-600 hover:from-blue-700 hover:to-loklernen-ultramarine text-white"
                onClick={handleShowAnswer}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}
              </Button>

              {!isMobile && (
                <div className="text-xs text-gray-500 text-center mt-2">
                  Drücke die Leertaste, um die Antwort anzuzeigen
                </div>
              )}
            </>
          ) : (
            // Answer Side
            <>
              <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
                {isMultipleChoice ? "Wähle die richtige Antwort" : "Antwort"}
              </div>
              
              {isMultipleChoice ? (
                <div className="flex-1 overflow-hidden">
                  <MultipleChoiceQuestion 
                    question={question} 
                    onAnswer={handleMCAnswer} 
                    isMobile={isMobile}
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto pb-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                      <div className={`${answerTextClass} font-medium text-blue-800`}>
                        <SafeRichText content={question?.answers?.[0]?.text || ''} />
                      </div>
                    </div>
                    
                    {question?.image_url && (
                      <div className="flex items-center justify-center">
                        {isMobile ? (
                          <img
                            src={question.image_url}
                            alt="Signal"
                            className="max-h-[200px] object-contain"
                          />
                        ) : (
                          <ZoomableImage
                            src={question.image_url}
                            alt="Signal"
                            containerClassName="w-full max-w-[200px] mx-auto mb-6"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {!answered && (
                    <>
                      {isMobile ? (
                        <div className="flex gap-3 mt-auto">
                          <Button 
                            variant="outline" 
                            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => handleAnswer(1)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Nicht gewusst
                          </Button>
                          <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAnswer(5)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Gewusst
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-4 justify-center mt-auto pt-4 border-t border-gray-100">
                          <Button 
                            variant="outline" 
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => handleAnswer(1)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Nicht gewusst
                          </Button>
                          <Button 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAnswer(5)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Gewusst
                          </Button>
                        </div>
                      )}

                      {!isMobile && (
                        <div className="text-xs text-gray-500 text-center mt-2">
                          Tastatur: ← Nicht gewusst | → Gewusst
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Swipe indicator for mobile non-MC questions */}
      {isMobile && flipped && !isMultipleChoice && (
        <SwipeIndicator 
          dragDelta={swipeState.dragDelta} 
          swipeThreshold={100} 
        />
      )}
    </div>
  );
}
