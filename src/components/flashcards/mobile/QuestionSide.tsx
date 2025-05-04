
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
    <div className="flex flex-col h-full p-4 bg-white">
      <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-3">Signal</div>
      
      {/* Question text moved above image for visibility */}
      <h2 className={`${textSizeClass} font-medium mb-4 text-gray-900`}>
        {question?.text}
      </h2>
      
      {/* Image container with AspectRatio for proper display */}
      <div className="flex-1 flex items-center justify-center mb-4">
        {question?.image_url && (
          <div className="w-full max-w-[280px] mx-auto">
            <AspectRatio ratio={1} className="bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={question.image_url} 
                alt="Signal" 
                className="w-full h-full object-contain p-2"
              />
            </AspectRatio>
          </div>
        )}
      </div>
      
      <Button 
        className="w-full py-6 mt-auto bg-loklernen-ultramarine text-white hover:bg-loklernen-sapphire"
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-5 w-5 mr-2" />
        Signal anzeigen
      </Button>
    </div>
  );
}
