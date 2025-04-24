
import React, { useState } from "react";
import { Question } from "@/types/questions";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleAnswer = () => {
    if (!question) return;

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = question.answers[0].text.trim().toLowerCase();
    const isAnswerCorrect = normalizedAnswer === normalizedCorrect;
    
    setIsCorrect(isAnswerCorrect);
    setAnswered(true);

    const score = isAnswerCorrect ? 5 : 0;
    onAnswer(score);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div 
        className={`relative h-[400px] w-full rounded-xl border bg-card shadow-sm transition-all duration-500 transform-gpu ${
          flipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div 
          className={`absolute inset-0 backface-hidden p-6 rounded-xl transition-opacity duration-300 ${
            flipped ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex h-full flex-col">
            <h2 className="text-lg font-medium mb-3">{question?.text}</h2>
            <div className="flex-1 flex items-center justify-center py-6">
              {question?.image_url && (
                <img 
                  src={question.image_url} 
                  alt="Signal" 
                  className="max-h-[200px] object-contain"
                />
              )}
            </div>
            <div className="pt-4">
              {!answered ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Deine Antwort..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && answer.trim()) {
                        e.preventDefault();
                        handleAnswer();
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                      }}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Lösung anzeigen
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (answer.trim()) {
                          handleAnswer();
                        }
                      }}
                      disabled={!answer.trim()}
                    >
                      Antwort prüfen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`rounded-md p-4 ${
                    isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {isCorrect ? "Richtig!" : "Leider falsch."}
                        </p>
                        <p className="text-sm">
                          {isCorrect 
                            ? "Du kennst dich aus!"
                            : `Die richtige Antwort ist: ${question.answers[0].text}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                      }}
                    >
                      Details ansehen
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                      }}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className={`absolute inset-0 backface-hidden rotate-y-180 p-6 rounded-xl transition-opacity duration-300 ${
            !flipped ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex h-full flex-col">
            <h2 className="text-lg font-medium mb-3">Lösung</h2>
            <div className="flex flex-col flex-1 gap-4 pt-4">
              <div className="flex items-center justify-center">
                {question?.image_url && (
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="max-h-[150px] object-contain"
                  />
                )}
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium text-lg text-blue-800">{question?.answers[0].text}</p>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Achte auf die charakteristischen Merkmale dieses Signals und präge dir die korrekte Bezeichnung ein.</p>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlipped(false);
                  }}
                >
                  Zurück zur Frage
                </Button>
                <Button 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                >
                  Weiter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
