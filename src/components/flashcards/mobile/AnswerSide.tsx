
import React from "react";
import { Question } from "@/types/questions";
import FlashcardActionButton from "../FlashcardActionButton";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import ZoomableImage from "@/components/common/ZoomableImage";
import { SwipeLeft, SwipeRight } from "lucide-react";

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
    <div className="flex flex-col h-full p-4 bg-white">
      <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-3">Antwort</div>
      
      {/* Scrollable content area with padding at bottom to ensure visibility of buttons */}
      <div className="flex-1 flex flex-col overflow-y-auto pb-24">
        {/* Answer content with clear text */}
        <div className="bg-blue-50 p-4 rounded-xl w-full shadow-sm border border-blue-100 mb-6">
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
        
        {/* Image container with ZoomableImage */}
        {question?.image_url && (
          <ZoomableImage
            src={question.image_url}
            alt="Signal"
            containerClassName="w-full max-w-[200px] mx-auto mb-6"
          />
        )}
      </div>
      
      {/* Floating action buttons with fixed positioning and swipe hint */}
      {!answered && (
        <div className="absolute left-0 right-0 bottom-4 flex flex-col items-center">
          {/* Swipe hint with visual indicators */}
          <div className="bg-gray-800/70 text-white px-4 py-2 rounded-full mb-4 flex items-center gap-2">
            <SwipeLeft className="h-4 w-4 text-red-300" />
            <span className="text-sm">Nicht gewusst</span>
            <span className="mx-1">|</span>
            <span className="text-sm">Gewusst</span>
            <SwipeRight className="h-4 w-4 text-green-300" />
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-center items-center space-x-6">
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
        </div>
      )}
    </div>
  );
}
