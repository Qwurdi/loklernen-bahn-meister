
import React, { useState } from 'react';
import { Question } from '@/types/questions';
import { Lightbulb, Check, X } from 'lucide-react';
import { useCardSwipe } from '@/components/learning/swipe/useCardSwipe';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { getTextValue } from '@/types/rich-text';
import AdaptiveImage from './AdaptiveImage';
import ExpandableText from './ExpandableText';
import HintButton from '@/components/flashcards/HintButton';
import MobileMultipleChoice from '@/components/flashcards/mobile/MobileMultipleChoice';
import SwipeIndicator from '@/components/flashcards/mobile/SwipeIndicator';

interface MobileFlashcardDisplayProps {
  question: Question;
  onAnswer: (score: number) => void;
  className?: string;
}

export default function MobileFlashcardDisplay({ 
  question, 
  onAnswer, 
  className = '' 
}: MobileFlashcardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Convert content to plain text for dynamic sizing
  const questionTextValue = getTextValue(question.text);
  const answerTextValue = getTextValue(question?.answers?.[0]?.text || '');
  
  // Dynamic text sizing
  const questionTextClass = useDynamicTextSize(questionTextValue, 'question');
  const answerTextClass = useDynamicTextSize(answerTextValue, 'answer');

  // Swipe functionality
  const { 
    cardRef, 
    swipeState, 
    handlers, 
    getCardStyle, 
    getCardClasses 
  } = useCardSwipe({
    onSwipeLeft: () => handleAnswer(1),
    onSwipeRight: () => handleAnswer(5),
    onShowAnswer: handleShowAnswer,
    isFlipped,
    isAnswered,
    disableSwipe: isMultipleChoice && isFlipped
  });

  function handleShowAnswer() {
    setIsFlipped(true);
  }

  function handleAnswer(score: number) {
    setIsAnswered(true);
    onAnswer(score);
  }

  function handleMCAnswer(isCorrect: boolean) {
    handleAnswer(isCorrect ? 5 : 1);
  }

  return (
    <div className={`h-full w-full touch-none ${className}`}>
      <div 
        ref={cardRef}
        className={`w-full h-full bg-white rounded-xl shadow-lg relative overflow-hidden ${getCardClasses()}`}
        style={getCardStyle()}
        onClick={!isFlipped ? handleShowAnswer : undefined}
        onTouchStart={isFlipped ? handlers.handleTouchStart : undefined}
        onTouchMove={isFlipped ? handlers.handleTouchMove : undefined}
        onTouchEnd={isFlipped ? handlers.handleTouchEnd : undefined}
      >
        {!isFlipped ? (
          // Question Side
          <div className="flex flex-col h-full p-4">
            {/* Category badge */}
            <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-3">
              {isMultipleChoice ? "Multiple Choice" : "Signal"}
            </div>
            
            {/* Question text - expandable */}
            <ExpandableText 
              content={question.text}
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
                  miniatureThreshold={250}
                  className="max-w-full"
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
            
            {/* Tap hint */}
            <div className="text-center text-sm text-gray-500 mb-4">
              Tippe auf die Karte, um die Antwort zu sehen
            </div>
            
            {/* Show answer button */}
            <button 
              className="w-full py-3 bg-gradient-to-r from-loklernen-ultramarine to-blue-600 text-white rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-98"
              onClick={handleShowAnswer}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}
            </button>
          </div>
        ) : (
          // Answer Side
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
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <ExpandableText 
                    content={question?.answers?.[0]?.text || ''}
                    textSizeClass={`${answerTextClass} font-bold text-blue-800`}
                    maxLines={4}
                  />
                </div>
                
                {/* Answer image */}
                {question?.image_url && (
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <AdaptiveImage
                      src={question.image_url}
                      alt="Signal"
                      maxHeight={300}
                      miniatureThreshold={200}
                      className="max-w-full"
                    />
                  </div>
                )}

                {/* Action buttons */}
                {!isAnswered && (
                  <div className="flex gap-4 mt-auto">
                    <button 
                      onClick={() => handleAnswer(1)}
                      className="flex-1 py-3 bg-white border-2 border-red-200 text-red-700 rounded-lg font-medium flex items-center justify-center transition-colors active:bg-red-50"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Nicht gewusst
                    </button>
                    <button 
                      onClick={() => handleAnswer(5)}
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
        )}
      </div>

      {/* Swipe indicator for non-MC questions */}
      {isFlipped && !isMultipleChoice && (
        <SwipeIndicator 
          dragDelta={swipeState.dragDelta} 
          swipeThreshold={100} 
        />
      )}
    </div>
  );
}
