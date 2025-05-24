
import React from 'react';
import { Question } from '@/types/questions';
import { Check, X } from 'lucide-react';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { getTextValue } from '@/types/rich-text';
import AdaptiveImage from '../AdaptiveImage';
import ExpandableText from '../ExpandableText';
import MobileMultipleChoice from '@/components/flashcards/mobile/MobileMultipleChoice';

interface MobileFlashcardAnswerSideProps {
  question: Question;
  isAnswered: boolean;
  onAnswer: (score: number) => void;
}

export default function MobileFlashcardAnswerSide({ 
  question, 
  isAnswered, 
  onAnswer 
}: MobileFlashcardAnswerSideProps) {
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Convert content to plain text for dynamic sizing
  const answerTextValue = getTextValue(question?.answers?.[0]?.text || '');
  const answerTextClass = useDynamicTextSize(answerTextValue, 'answer');

  function handleMCAnswer(isCorrect: boolean) {
    onAnswer(isCorrect ? 5 : 1);
  }

  return (
    <div className="flex flex-col h-full p-4">
      {/* Category badge */}
      <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-3">
        {isMultipleChoice ? "Wähle die richtige Antwort" : "Antwort"}
      </div>
      
      {isMultipleChoice ? (
        <div className="flex-1 overflow-hidden">
          <MobileMultipleChoice
            question={question}
            onAnswer={handleMCAnswer}
          />
        </div>
      ) : (
        <>
          {/* Answer text */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 flex-shrink-0">
            <ExpandableText 
              content={answerTextValue}
              textSizeClass={`${answerTextClass} font-bold text-blue-800`}
              maxLines={4}
            />
          </div>
          
          {/* Answer image - takes available space */}
          {question?.image_url && (
            <div className="flex-1 min-h-0 flex items-center justify-center mb-4">
              <AdaptiveImage
                src={question.image_url}
                alt="Signal"
                maxHeight={400}
                miniatureThreshold={200}
                className="max-w-full h-full"
              />
            </div>
          )}

          {/* Action buttons - fixed at bottom */}
          {!isAnswered && (
            <div className="flex gap-4 flex-shrink-0">
              <button 
                onClick={() => onAnswer(1)}
                className="flex-1 py-3 bg-white border-2 border-red-200 text-red-700 rounded-lg font-medium flex items-center justify-center transition-colors active:bg-red-50"
              >
                <X className="h-5 w-5 mr-2" />
                Nicht gewusst
              </button>
              <button 
                onClick={() => onAnswer(5)}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors active:bg-green-700"
              >
                <Check className="h-5 w-5 mr-2" />
                Gewusst
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
