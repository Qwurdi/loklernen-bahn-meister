
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface HintButtonProps {
  hint?: string | null;
  question: string;
  answers?: Array<{ text: string, isCorrect: boolean }>;
}

export default function HintButton({ hint, question, answers = [] }: HintButtonProps) {
  const [showHint, setShowHint] = useState(false);

  // Generate a generic hint if no custom hint is provided
  const getGeneratedHint = (): string => {
    // If we have answers with at least one correct one
    if (answers && answers.length > 0) {
      const correctAnswers = answers.filter(a => a.isCorrect);
      if (correctAnswers.length > 0) {
        const firstCorrectAnswer = correctAnswers[0].text;
        const words = firstCorrectAnswer.split(' ');
        
        if (words.length <= 3) {
          return `Die Antwort beginnt mit "${words[0]}..."`;
        } else {
          return `Die richtige Antwort hat etwas mit "${words[1]} ${words[2]}" zu tun.`;
        }
      }
    }
    
    // Default hint based on question length
    const words = question.split(' ');
    if (words.length > 5) {
      return `Achten Sie auf die Begriffe "${words[2]}" und "${words[3]}" in der Frage.`;
    } else {
      return "Überlegen Sie, was die Hauptbedeutung dieses Elements im Eisenbahnbetrieb ist.";
    }
  };

  const displayHint = hint || getGeneratedHint();
  
  return (
    <div>
      {!showHint ? (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowHint(true)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
        >
          <Lightbulb className="h-3 w-3 mr-1" />
          Tipp anzeigen
        </Button>
      ) : (
        <div className="hint-text animate-fade-in">
          {displayHint}
        </div>
      )}
    </div>
  );
}
