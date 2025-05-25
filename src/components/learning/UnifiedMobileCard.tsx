
import React from 'react';
import { Question } from '@/types/questions';
import { Lightbulb, Check, X } from 'lucide-react';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { getTextValue } from '@/types/rich-text';
import { useCardState } from '@/hooks/learning/useCardState';
import { useEnhancedCardSwipe } from '@/components/flashcards/mobile/swipe/useEnhancedCardSwipe';
import SwipeIndicator from '@/components/flashcards/mobile/SwipeIndicator';
import AdaptiveImage from './AdaptiveImage';
import ExpandableText from './ExpandableText';
import EnhancedMobileMultipleChoice from './EnhancedMobileMultipleChoice';
import HintButton from '@/components/flashcards/HintButton';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface UnifiedMobileCardProps {
  question: Question;
  onAnswer: (score: number) => void;
}

export default function UnifiedMobileCard({ question, onAnswer }: UnifiedMobileCardProps) {
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  const { isFlipped, isAnswered, swipeEnabled, showAnswer, submitAnswer } = useCardState({
    question,
    onAnswerSubmitted: () => {} // No automatic next here
  });

  // Enhanced swipe functionality
  const { 
    cardRef, 
    swipeState, 
    handlers, 
    getCardStyle, 
    getCardClasses,
    handleCardTap
  } = useEnhancedCardSwipe({
    onSwipeLeft: () => handleAnswer(1),
    onSwipeRight: () => handleAnswer(5),
    onShowAnswer: showAnswer,
    isFlipped,
    isAnswered,
    disableSwipe: isMultipleChoice || !swipeEnabled
  });

  function handleAnswer(score: number) {
    submitAnswer(score);
    onAnswer(score);
  }

  function handleMCAnswer(isCorrect: boolean) {
    handleAnswer(isCorrect ? 5 : 1);
  }

  // Text sizing for dynamic content
  const questionTextValue = getTextValue(question.text);
  const questionTextClass = useDynamicTextSize(questionTextValue, 'question');
  
  const answerTextValue = getTextValue(question?.answers?.[0]?.text || '');
  const answerTextClass = useDynamicTextSize(answerTextValue, 'answer');

  return (
    <div className="h-full w-full touch-none">
      <div 
        ref={cardRef}
        className={`w-full h-full bg-white rounded-xl shadow-lg relative overflow-hidden transition-all duration-200 ${getCardClasses()}`}
        style={getCardStyle()}
        onClick={!isFlipped ? handleCardTap : undefined}
        onTouchStart={isFlipped && swipeEnabled ? handlers.handleTouchStart : undefined}
        onTouchMove={isFlipped && swipeEnabled ? handlers.handleTouchMove : undefined}
        onTouchEnd={isFlipped && swipeEnabled ? handlers.handleTouchEnd : undefined}
      >
        {/* Feedback overlay */}
        <div className="feedback-overlay absolute inset-0 opacity-0 transition-opacity duration-200 pointer-events-none rounded-xl" />
        
        {!isFlipped ? (
          // Question Side
          <div className="flex flex-col h-full p-4">
            <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-3 transition-all duration-200">
              {isMultipleChoice ? "Multiple Choice" : "Signal"}
            </div>
            
            <ExpandableText 
              content={questionTextValue}
              textSizeClass={questionTextClass}
              maxLines={3}
              className="mb-4"
            />
            
            {question.image_url && (
              <div className="flex-1 min-h-0 flex items-center justify-center mb-4">
                <AdaptiveImage
                  src={question.image_url}
                  alt="Signal"
                  maxHeight={400}
                  miniatureThreshold={200}
                  className="max-w-full h-full transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="flex-shrink-0 space-y-3">
              <HintButton 
                hint={question.hint}
                question={questionTextValue}
                answers={question.answers}
                minimal={true}
              />
              
              <div className="text-center text-sm text-gray-500 animate-pulse">
                Tippe auf die Karte, um die Antwort zu sehen
              </div>
              
              <EnhancedButton 
                className="w-full py-3 bg-gradient-to-r from-loklernen-ultramarine to-blue-600 text-white rounded-lg flex items-center justify-center shadow-md"
                hapticType="medium"
                visualFeedback={true}
                springAnimation={true}
                onClick={(e) => {
                  e.stopPropagation();
                  showAnswer();
                }}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}
              </EnhancedButton>
            </div>
          </div>
        ) : (
          // Answer Side
          <div className="flex flex-col h-full p-4">
            <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-3 transition-all duration-200">
              {isMultipleChoice ? "Wähle die richtige Antwort" : "Antwort"}
            </div>
            
            {isMultipleChoice ? (
              <div className="flex-1 overflow-hidden">
                <EnhancedMobileMultipleChoice
                  question={question}
                  onAnswer={handleMCAnswer}
                />
              </div>
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 flex-shrink-0 transition-all duration-300">
                  <ExpandableText 
                    content={answerTextValue}
                    textSizeClass={`${answerTextClass} font-bold text-blue-800`}
                    maxLines={4}
                  />
                </div>
                
                {question?.image_url && (
                  <div className="flex-1 min-h-0 flex items-center justify-center mb-4">
                    <AdaptiveImage
                      src={question.image_url}
                      alt="Signal"
                      maxHeight={300}
                      miniatureThreshold={150}
                      className="max-w-full h-full transition-transform duration-300"
                      showOnAnswerSide={true}
                    />
                  </div>
                )}

                {!isAnswered && (
                  <div className="flex gap-4 flex-shrink-0">
                    <EnhancedButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswer(1);
                      }}
                      hapticType="error"
                      className="flex-1 py-3 bg-white border-2 border-red-200 text-red-700 rounded-lg font-medium flex items-center justify-center"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Nicht gewusst
                    </EnhancedButton>
                    <EnhancedButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswer(5);
                      }}
                      hapticType="success"
                      className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Gewusst
                    </EnhancedButton>
                  </div>
                )}

                {!isAnswered && !isMultipleChoice && swipeEnabled && (
                  <div className="text-center text-xs text-gray-500 mt-2 animate-pulse">
                    Oder wische links/rechts
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Enhanced swipe indicator */}
      {isFlipped && !isMultipleChoice && swipeEnabled && (
        <SwipeIndicator 
          dragDelta={swipeState.dragDelta} 
          swipeThreshold={100} 
        />
      )}
      
      {/* Swipe availability hint with animation */}
      {isFlipped && !isMultipleChoice && !swipeEnabled && !isAnswered && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm animate-pulse">
          Wische in 1 Sekunde verfügbar
        </div>
      )}
    </div>
  );
}
