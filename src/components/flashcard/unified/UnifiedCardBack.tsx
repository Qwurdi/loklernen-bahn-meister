
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import ZoomableImage from '@/components/common/ZoomableImage';
import MultipleChoiceQuestion from '@/components/flashcards/MultipleChoice';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnifiedCardBackProps {
  question: Question;
  regulationPreference: RegulationFilterType;
  isAnswered: boolean;
  isMultipleChoice: boolean;
  onAnswer: (score: number) => void;
}

export default function UnifiedCardBack({
  question,
  regulationPreference,
  isAnswered,
  isMultipleChoice,
  onAnswer
}: UnifiedCardBackProps) {
  const isMobile = useIsMobile();
  const answerTextClass = useDynamicTextSize(
    question?.answers?.[0]?.text || '', 
    'answer'
  );

  const handleMCAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect ? 5 : 1);
  };

  return (
    <>
      <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
        {isMultipleChoice ? "Wähle die richtige Antwort" : "Antwort"}
      </div>
      
      {isMultipleChoice ? (
        <div className="flex-1 overflow-hidden">
          <MultipleChoiceQuestion 
            question={question} 
            onAnswer={handleMCAnswer} 
            isMobile={isMobile}
          />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pb-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
              <div className={`${answerTextClass} font-medium text-blue-800`}>
                <SafeRichText content={question?.answers?.[0]?.text || ''} />
              </div>
            </div>
            
            {question?.image_url && (
              <div className="flex items-center justify-center">
                {isMobile ? (
                  <img
                    src={question.image_url}
                    alt="Signal"
                    className="max-h-[200px] object-contain"
                  />
                ) : (
                  <ZoomableImage
                    src={question.image_url}
                    alt="Signal"
                    containerClassName="w-full max-w-[200px] mx-auto mb-6"
                  />
                )}
              </div>
            )}
          </div>

          {!isAnswered && (
            <>
              {isMobile ? (
                <div className="flex gap-3 mt-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => onAnswer(1)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Nicht gewusst
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onAnswer(5)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Gewusst
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4 justify-center mt-auto pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => onAnswer(1)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Nicht gewusst
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onAnswer(5)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Gewusst
                  </Button>
                </div>
              )}

              {!isMobile && (
                <div className="text-xs text-gray-500 text-center mt-2">
                  Tastatur: ← Nicht gewusst | → Gewusst
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
