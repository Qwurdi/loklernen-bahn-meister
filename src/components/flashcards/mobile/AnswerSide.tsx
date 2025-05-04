
import React from "react";
import { Question } from "@/types/questions";
import FlashcardActionButton from "../FlashcardActionButton";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface AnswerSideProps {
  question: Question;
  answered: boolean;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function AnswerSide({ 
  question, 
  answered,
  onKnown, 
  onNotKnown 
}: AnswerSideProps) {
  // Get the correct answer text
  const answerText = question?.answers?.[0]?.text || '';
  
  // Use dynamic text sizing based on answer length
  const textSizeClass = useDynamicTextSize(answerText, 'answer');
  
  return (
    <div className="flex flex-col h-full bg-white p-4">
      <div className="bg-blue-100 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-2">Antwort</div>
      
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col items-center w-full pb-16">
          {/* Fixed height container for the image with proper containment */}
          {question?.image_url && (
            <div className="w-full mb-6">
              <AspectRatio ratio={4/3} className="max-h-[180px] bg-gray-50 rounded-md">
                <img 
                  src={question.image_url} 
                  alt="Signal" 
                  className="w-full h-full object-contain p-2"
                />
              </AspectRatio>
            </div>
          )}
          
          <div className="bg-blue-50 p-5 rounded-xl w-full shadow-sm border border-blue-100 mb-8 overflow-y-auto max-h-[40%]">
            {question?.category === "Signale" ? (
              <div className="space-y-3">
                {answerText.split('\n').map((line, i) => (
                  <p key={i} className={`${textSizeClass} font-bold text-blue-800`}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className={`${textSizeClass} font-medium text-blue-800`}>
                {answerText}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating action buttons */}
      {!answered && (
        <div className="absolute left-0 right-0 bottom-4 flex justify-center items-center space-x-6">
          <div className="text-xs text-gray-500 absolute -top-5 w-full text-center">
            Nach links wischen = Nicht gewusst | Nach rechts = Gewusst
          </div>
          <FlashcardActionButton
            variant="unknown"
            onClick={onNotKnown}
            isMobile={true}
          />
          <FlashcardActionButton
            variant="known"
            onClick={onKnown}
            isMobile={true}
          />
        </div>
      )}
    </div>
  );
}
