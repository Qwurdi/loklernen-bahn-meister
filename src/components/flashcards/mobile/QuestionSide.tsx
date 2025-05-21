
import React from "react";
import { Question } from "@/types/questions";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";
import HintButton from "../HintButton";

interface QuestionSideProps {
  question: Question;
  onShowAnswer: () => void;
}

export default function QuestionSide({ question, onShowAnswer }: QuestionSideProps) {
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Dynamic text size based on content length
  const textClass = useDynamicTextSize(question.text, 'question');
  
  return (
    <Card className="border-none shadow-none h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Signal type label */}
        <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
          {question.question_type === "open" ? "Signal" : "Multiple Choice"}
        </div>
        
        {/* Question text */}
        <div className={`${textClass} font-medium mb-4 text-gray-900`}>
          <SafeRichText content={question.text} />
        </div>
        
        {/* Question image - if available */}
        {question.image_url && (
          <div className="flex-1 flex items-center justify-center mb-4">
            <img 
              src={question.image_url} 
              alt="Question" 
              className="max-h-full object-contain rounded-md"
            />
          </div>
        )}
        
        {/* Hint button */}
        <div className="mb-3">
          <HintButton 
            hint={question.hint}
            question={question.text}
            answers={question.answers}
            minimal={true}
          />
        </div>
        
        {/* Tap to flip instruction */}
        <div className="flip-hint">
          Tippe auf die Karte oder den Button, um die Antwort zu sehen
        </div>
        
        {/* Show answer button */}
        <Button 
          className="w-full bg-gradient-to-r from-loklernen-ultramarine to-blue-600 hover:from-blue-700 hover:to-loklernen-ultramarine text-white"
          onClick={onShowAnswer}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          {isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}
        </Button>
      </CardContent>
    </Card>
  );
}
