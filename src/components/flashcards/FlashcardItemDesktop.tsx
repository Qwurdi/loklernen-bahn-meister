
import React from "react";
import { Question } from "@/types/questions";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FlashcardActionButton from "./FlashcardActionButton";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import ZoomableImage from "@/components/common/ZoomableImage";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";

interface FlashcardItemDesktopProps {
  question: Question;
  flipped: boolean;
  answered: boolean;
  onShowAnswer: () => void;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function FlashcardItemDesktop({ 
  question, 
  flipped, 
  answered,
  onShowAnswer,
  onKnown,
  onNotKnown
}: FlashcardItemDesktopProps) {
  // Check if this is a multiple choice question
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Use dynamic text sizing
  const questionTextClass = useDynamicTextSize(question?.text || '', 'question');
  const answerTextClass = useDynamicTextSize(question?.answers?.[0]?.text || '', 'answer');
  
  // Handler for MC question answers
  const handleMCAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      onKnown();
    } else {
      onNotKnown();
    }
  };
  
  return (
    <div className="mx-auto max-w-md">
      <Card className="relative p-6 min-h-[500px] flex flex-col bg-white shadow-md">
        {!flipped ? (
          <div className="flex flex-col h-full">
            {/* Question text first */}
            <h2 className={`${questionTextClass} font-medium mb-6 text-gray-900`}>
              {question?.text}
            </h2>
            
            {/* Image with zoomable functionality */}
            {question?.image_url && (
              <div className="flex-1 flex items-center justify-center mb-6">
                <ZoomableImage
                  src={question.image_url}
                  alt="Signal"
                  containerClassName="w-full max-w-[200px]" 
                />
              </div>
            )}
            
            <div className="mt-auto">
              <Button 
                className="w-full bg-loklernen-ultramarine hover:bg-loklernen-sapphire"
                onClick={onShowAnswer}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {isMultipleChoice ? "Antwortoptionen anzeigen" : "Signal anzeigen"}
              </Button>
              <div className="text-xs text-gray-500 text-center mt-2">
                Drücke die Leertaste, um die Antwort anzuzeigen
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-blue-700">
                {isMultipleChoice ? "Wähle die richtige Antwort" : "Antwort"}
              </h2>
            </div>
            
            {/* For Multiple Choice questions */}
            {isMultipleChoice ? (
              <MultipleChoiceQuestion 
                question={question} 
                onAnswer={handleMCAnswer} 
                isMobile={false}
              />
            ) : (
              // For open questions - original code
              <div className="flex flex-col h-full">
                {/* Scrollable answer content container with padding to ensure buttons visibility */}
                <div className="flex-1 overflow-y-auto pb-20">
                  {/* Answer content with proper styling */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    {question?.category === "Signale" ? (
                      <div className="space-y-2">
                        {question?.answers?.[0]?.text.split('\n').map((line, i) => (
                          <p key={i} className={`${answerTextClass} font-medium text-blue-800`}>
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className={`${answerTextClass} font-medium text-blue-800`}>
                        {question?.answers?.[0]?.text}
                      </p>
                    )}
                  </div>
                  
                  {/* Image with ZoomableImage */}
                  {question?.image_url && (
                    <ZoomableImage
                      src={question.image_url}
                      alt="Signal"
                      containerClassName="w-full max-w-[200px] mx-auto mb-6"
                    />
                  )}
                </div>

                {/* Sticky button container at the bottom */}
                {!answered && (
                  <div className="w-full flex flex-row gap-4 justify-center sticky bottom-0 pt-4 bg-white z-10 border-t border-gray-100 mt-2">
                    <FlashcardActionButton 
                      variant="unknown" 
                      onClick={onNotKnown} 
                      label="Nicht gewusst"
                    />
                    <FlashcardActionButton 
                      variant="known" 
                      onClick={onKnown} 
                      label="Gewusst"
                    />
                  </div>
                )}
                
                <div className="text-xs text-gray-500 text-center w-full mt-4">
                  Tastatur: ← Nicht gewusst | → Gewusst
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
