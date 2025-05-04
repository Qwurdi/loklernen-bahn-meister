
import React from "react";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface QuestionSideProps {
  question: Question;
  onShowAnswer: () => void;
}

export default function QuestionSide({ question, onShowAnswer }: QuestionSideProps) {
  // Use dynamic text sizing based on question length
  const textSizeClass = useDynamicTextSize(question?.text || '', 'question');
  
  return (
    <div className="flex flex-col h-full bg-white p-4">
      <div className="bg-loklernen-ultramarine text-white px-3 py-1.5 rounded-full text-xs self-start mb-2">
        {question?.category || "Signal"}
      </div>
      
      {/* Dynamic text size with overflow handling */}
      <h2 className={`${textSizeClass} font-medium mb-4 overflow-y-auto max-h-[25%] text-gray-800`}>
        {question?.text}
      </h2>
      
      {/* Fixed height container for image using AspectRatio for proper containment */}
      {question?.image_url && (
        <div className="flex-1 flex items-center justify-center py-4 min-h-[240px]">
          <AspectRatio ratio={4/3} className="w-full max-h-[240px] bg-gray-50 rounded-md">
            <img 
              src={question.image_url} 
              alt="Signal" 
              className="w-full h-full object-contain p-2"
            />
          </AspectRatio>
        </div>
      )}
      
      <Button 
        className="w-full py-6 mt-auto bg-loklernen-ultramarine text-white hover:bg-loklernen-ultramarine/90"
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-5 w-5 mr-2" />
        Signal anzeigen
      </Button>
    </div>
  );
}
