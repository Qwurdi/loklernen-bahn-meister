
import React from "react";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface QuestionSideProps {
  question: Question;
  onShowAnswer: () => void;
}

export default function QuestionSide({ question, onShowAnswer }: QuestionSideProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-500 self-start mb-2">Signal</div>
      <h2 className="text-lg font-medium mb-4">{question?.text}</h2>
      <div className="flex-1 flex items-center justify-center py-8">
        {question?.image_url && (
          <img 
            src={question.image_url} 
            alt="Signal" 
            className="max-h-[240px] max-w-full object-contain"
          />
        )}
      </div>
      <Button 
        className="w-full py-6 mt-auto bg-loklernen-sapphire text-white hover:bg-loklernen-sapphire/90"
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-5 w-5 mr-2" />
        Signal anzeigen
      </Button>
    </div>
  );
}
