
import React from "react";
import { Question } from "@/types/questions";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FlashcardActionButton from "./FlashcardActionButton";

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
