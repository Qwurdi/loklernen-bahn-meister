
import React from "react";
import { Button } from "@/components/ui/button";

interface FeedbackSectionProps {
  isCorrect: boolean;
  onNext: () => void;
}

export default function FeedbackSection({ isCorrect, onNext }: FeedbackSectionProps) {
  return (
    <div className="mt-4 flex flex-col">
      <div className={`mb-3 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'} mc-feedback`}>
        {isCorrect 
          ? "Korrekt! Gut gemacht!" 
          : "Nicht ganz richtig. Die richtige Antwort ist markiert."}
      </div>
      <Button 
        onClick={onNext} 
        className="bg-loklernen-ultramarine hover:bg-loklernen-sapphire"
      >
        Weiter zur nächsten Frage
      </Button>
    </div>
  );
}
