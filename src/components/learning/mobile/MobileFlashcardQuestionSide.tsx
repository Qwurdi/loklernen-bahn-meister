
import React from 'react';
import { Question } from '@/types/questions';
import { Lightbulb } from 'lucide-react';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { getTextValue } from '@/types/rich-text';
import AdaptiveImage from '../AdaptiveImage';
import ExpandableText from '../ExpandableText';
import HintButton from '@/components/flashcards/HintButton';

interface MobileFlashcardQuestionSideProps {
  question: Question;
  onShowAnswer: () => void;
}

export default function MobileFlashcardQuestionSide({ 
  question, 
  onShowAnswer 
}: MobileFlashcardQuestionSideProps) {
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Convert content to plain text for dynamic sizing
  const questionTextValue = getTextValue(question.text);
  const questionTextClass = useDynamicTextSize(questionTextValue, 'question');

  return (
    <div className="flex flex-col h-full p-4">
      {/* Category badge */}
      <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-3">
        {isMultipleChoice ? "Multiple Choice" : "Signal"}
      </div>
      
      {/* Question text - expandable */}
      <ExpandableText 
        content={questionTextValue}
        textSizeClass={questionTextClass}
        maxLines={3}
        className="mb-4"
      />
      
      {/* Image - adaptive sizing */}
      {question.image_url && (
        <div className="flex-1 flex items-center justify-center mb-4">
          <AdaptiveImage
            src={question.image_url}
            alt="Signal"
            maxHeight={400}
            miniatureThreshold={150}
            className="max-w-full"
          />
        </div>
      )}
      
      {/* Hint button */}
      <div className="mb-3">
        <HintButton 
          hint={question.hint}
          question={questionTextValue}
          answers={question.answers}
          minimal={true}
        />
      </div>
      
      {/* Tap hint */}
      <div className="text-center text-sm text-gray-500 mb-4">
        Tippe auf die Karte, um die Antwort zu sehen
      </div>
      
      {/* Show answer button */}
      <button 
        className="w-full py-3 bg-gradient-to-r from-loklernen-ultramarine to-blue-600 text-white rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-98"
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        {isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}
      </button>
    </div>
  );
}
