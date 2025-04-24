
import React, { useState, useEffect } from "react";
import { Question } from "@/types/questions";
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from "lucide-react";
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
  const [isCorrect, setIsCorrect] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Reset state when question changes
    setFlipped(showAnswer);
    setAnswered(false);
    setIsCorrect(false);
    setConfidenceScore(null);
  }, [question, showAnswer]);

  const handleShowAnswer = () => {
    setFlipped(true);
  };

  const handleSelfAssessment = (knewAnswer: boolean) => {
    setAnswered(true);
    setIsCorrect(knewAnswer);
    
    // In self-assessment mode, user indicates if they knew the answer
    const score = knewAnswer ? 5 : 0;
    onAnswer(score);
  };
  
  const handleConfidenceRating = (score: number) => {
    setConfidenceScore(score);
    onAnswer(score);
    onNext();
  };

  const confidenceLabels: Record<number, string> = {
    1: "Nicht gewusst",
    2: "Unsicher",
    3: "Mit Mühe",
    4: "Gut",
    5: "Perfekt"
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className={`relative p-4 ${isMobile ? 'min-h-[400px]' : 'min-h-[450px]'} flex flex-col`}>
        {/* Card front */}
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
            </div>
          </div>
        ) : (
          // Card back
          <div className="flex flex-col h-full">
            <div className="mb-3">
              <h2 className="text-lg font-medium">Antwort</h2>
              {!answered && (
                <p className="text-sm text-muted-foreground">
                  Kanntest du die Antwort?
                </p>
              )}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-between gap-4">
              <div className="flex flex-col items-center">
                {question?.image_url && (
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="max-h-[140px] object-contain mb-4"
                  />
                )}
                
                <div className="bg-blue-50 p-4 rounded-md w-full">
                  <p className="font-medium text-lg text-blue-800">{question?.answers[0].text}</p>
                </div>
              </div>
              
              {!answered ? (
                <div className="w-full grid grid-cols-2 gap-4 mt-2">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleSelfAssessment(false)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Nicht gewusst
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleSelfAssessment(true)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Gewusst
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <p className="text-sm font-medium mb-2">Wie gut kanntest du die Antwort?</p>
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => handleConfidenceRating(score)}
                        className={`transition-colors ${
                          score < 3 ? "hover:bg-red-50 hover:text-red-700" : 
                          score === 3 ? "hover:bg-yellow-50 hover:text-yellow-700" :
                          "hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Nicht gewusst</span>
                    <span>Perfekt</span>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => handleConfidenceRating(isCorrect ? 4 : 1)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Weiter
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
