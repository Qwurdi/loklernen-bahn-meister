
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import ZoomableImage from '@/components/common/ZoomableImage';
import HintButton from '@/components/flashcards/HintButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnifiedCardFrontProps {
  question: Question;
  regulationPreference: RegulationFilterType;
  showHints: boolean;
  onShowAnswer: () => void;
}

export default function UnifiedCardFront({
  question,
  regulationPreference,
  showHints,
  onShowAnswer
}: UnifiedCardFrontProps) {
  const isMobile = useIsMobile();
  const questionTextClass = useDynamicTextSize(question.text, 'question');
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";

  return (
    <>
      <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
        {isMultipleChoice ? "Multiple Choice" : question.sub_category}
      </div>
      
      <div className={`${questionTextClass} font-medium mb-4 text-gray-900`}>
        <SafeRichText content={question.text} />
      </div>
      
      {question.image_url && (
        <div className="flex-1 flex items-center justify-center mb-4">
          {isMobile ? (
            <img 
              src={question.image_url} 
              alt="Question" 
              className="max-h-full object-contain rounded-md"
            />
          ) : (
            <ZoomableImage
              src={question.image_url}
              alt="Signal"
              containerClassName="w-full max-w-[200px]" 
            />
          )}
        </div>
      )}
      
      {showHints && (
        <div className="mb-3">
          <HintButton 
            hint={question.hint}
            question={question.text}
            answers={question.answers}
            minimal={isMobile}
          />
        </div>
      )}
      
      {isMobile && (
        <div className="text-xs text-gray-500 text-center mb-2">
          Tippe auf die Karte oder den Button, um die Antwort zu sehen
        </div>
      )}
      
      <Button 
        className="w-full bg-gradient-to-r from-loklernen-ultramarine to-blue-600 hover:from-blue-700 hover:to-loklernen-ultramarine text-white"
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        {isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}
      </Button>

      {!isMobile && (
        <div className="text-xs text-gray-500 text-center mt-2">
          Drücke die Leertaste, um die Antwort anzuzeigen
        </div>
      )}
    </>
  );
}
