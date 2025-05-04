
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
      <Card className="relative p-6 min-h-[500px] flex flex-col bg-white shadow-md">
        {!flipped ? (
          <div className="flex flex-col h-full">
            {/* Question text first */}
            <h2 className={`${questionTextClass} font-medium mb-6 text-gray-900`}>
              {question?.text}
            </h2>
            
            {/* Image with aspect ratio for consistent display */}
            {question?.image_url && (
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="w-full max-w-[280px]">
                  <AspectRatio ratio={1} className="bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={question.image_url} 
                      alt="Signal" 
                      className="w-full h-full object-contain p-2"
                    />
                  </AspectRatio>
                </div>
              </div>
            )}
            
            <div className="mt-auto">
              <Button 
                className="w-full bg-loklernen-ultramarine hover:bg-loklernen-sapphire"
                onClick={onShowAnswer}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Signal anzeigen
              </Button>
              <div className="text-xs text-gray-500 text-center mt-2">
                Drücke die Leertaste, um die Antwort anzuzeigen
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-blue-700">Antwort</h2>
            </div>
            
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
            
            {/* Image with AspectRatio */}
            {question?.image_url && (
              <div className="w-full max-w-[250px] mx-auto mb-6">
                <AspectRatio ratio={1} className="bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="w-full h-full object-contain p-2"
                  />
                </AspectRatio>
              </div>
            )}

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
            
            <div className="text-xs text-gray-500 text-center w-full mt-4">
              Tastatur: ← Nicht gewusst | → Gewusst
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
