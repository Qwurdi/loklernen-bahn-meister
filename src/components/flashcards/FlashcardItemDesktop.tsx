
import React from "react";
import { Question } from "@/types/questions";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FlashcardActionButton from "./FlashcardActionButton";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  // Use dynamic text sizing
  const questionTextClass = useDynamicTextSize(question?.text || '', 'question');
  const answerTextClass = useDynamicTextSize(question?.answers?.[0]?.text || '', 'answer');
  
  return (
    <div className="mx-auto max-w-md">
      <Card className="relative p-4 min-h-[450px] flex flex-col bg-white">
        {!flipped ? (
          <div className="flex flex-col h-full">
            {/* Category badge */}
            <div className="bg-loklernen-ultramarine text-white px-3 py-1.5 rounded-full text-xs self-start mb-2">
              {question?.category || "Signal"}
            </div>
            
            {/* Dynamic question text size */}
            <h2 className={`${questionTextClass} font-medium mb-3 overflow-y-auto max-h-[25%] text-gray-800`}>
              {question?.text}
            </h2>
            
            {/* Fixed space for images with proper containment */}
            {question?.image_url && (
              <div className="flex-1 flex items-center justify-center py-4 min-h-[200px]">
                <AspectRatio ratio={4/3} className="w-full max-h-[200px] bg-gray-50 rounded-md">
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="w-full h-full object-contain p-2"
                  />
                </AspectRatio>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                className="w-full bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
                onClick={onShowAnswer}
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
              <div className="bg-blue-100 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start">Antwort</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-between gap-4">
              <div className="flex flex-col items-center w-full">
                {/* Fixed height for the image with proper containment */}
                {question?.image_url && (
                  <div className="w-full mb-4">
                    <AspectRatio ratio={4/3} className="max-h-[140px] bg-gray-50 rounded-md">
                      <img 
                        src={question.image_url} 
                        alt="Signal" 
                        className="w-full h-full object-contain p-2"
                      />
                    </AspectRatio>
                  </div>
                )}
                
                {/* Answer with dynamic text size */}
                <div className="bg-blue-50 p-4 rounded-md w-full shadow-sm border border-blue-100 mb-8 overflow-y-auto max-h-[40%]">
                  {question?.category === "Signale" ? (
                    <div className="space-y-2">
                      {question?.answers?.[0]?.text.split('\n').map((line, i) => (
                        <p key={i} className={`${answerTextClass} font-bold text-blue-800`}>
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
              </div>

              {!answered && (
                <div className="w-full flex flex-row gap-4 justify-center mt-auto">
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
