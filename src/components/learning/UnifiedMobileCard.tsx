
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
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
import { motion } from 'framer-motion';

interface UnifiedMobileCardProps {
  question: Question;
  onAnswer: (score: number) => void;
  regulationPreference: RegulationFilterType;
}

export default function UnifiedMobileCard({ 
  question, 
  onAnswer, 
  regulationPreference 
}: UnifiedMobileCardProps) {
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  const { isFlipped, isAnswered, swipeEnabled, showAnswer, submitAnswer } = useCardState({
    question,
    onAnswerSubmitted: () => {}
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
      <motion.div 
        ref={cardRef}
        className={`w-full h-full bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${getCardClasses()}`}
        style={getCardStyle()}
        onClick={!isFlipped ? handleCardTap : undefined}
        onTouchStart={isFlipped && swipeEnabled ? handlers.handleTouchStart : undefined}
        onTouchMove={isFlipped && swipeEnabled ? handlers.handleTouchMove : undefined}
        onTouchEnd={isFlipped && swipeEnabled ? handlers.handleTouchEnd : undefined}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {!isFlipped ? (
          // Question Side with modern design
          <div className="relative z-10 flex flex-col h-full p-6">
            {/* Header with regulation info */}
            <div className="flex items-center justify-between mb-4">
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-medium">
                {isMultipleChoice ? "Multiple Choice" : "Signal"}
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-medium">
                {regulationPreference}
              </div>
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
                  className="max-w-full h-full transition-transform duration-300 rounded-2xl shadow-lg"
                />
              </div>
            )}
            
            <div className="flex-shrink-0 space-y-4">
              <HintButton 
                hint={question.hint}
                question={questionTextValue}
                answers={question.answers}
                minimal={true}
              />
              
              <div className="text-center text-sm text-gray-500">
                Tippe auf die Karte, um die Antwort zu sehen
              </div>
              
              <motion.button
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl relative overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  showAnswer();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Lightbulb className="h-5 w-5" />
                  <span>{isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}</span>
                </div>
              </motion.button>
            </div>
          </div>
        ) : (
          // Answer Side with modern design
          <div className="relative z-10 flex flex-col h-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-medium">
                {isMultipleChoice ? "Wähle die richtige Antwort" : "Antwort"}
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-medium">
                {regulationPreference}
              </div>
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
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200/50 mb-4 flex-shrink-0 shadow-lg">
                  <ExpandableText 
                    content={answerTextValue}
                    textSizeClass={`${answerTextClass} font-bold text-emerald-800`}
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
                      className="max-w-full h-full transition-transform duration-300 rounded-2xl shadow-lg"
                      showOnAnswerSide={true}
                    />
                  </div>
                )}

                {!isAnswered && (
                  <div className="flex gap-4 flex-shrink-0">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswer(1);
                      }}
                      className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold flex items-center justify-center shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X className="h-5 w-5 mr-2" />
                      Nicht gewusst
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAnswer(5);
                      }}
                      className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold flex items-center justify-center shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Gewusst
                    </motion.button>
                  </div>
                )}

                {!isAnswered && !isMultipleChoice && swipeEnabled && (
                  <div className="text-center text-xs text-gray-500 mt-2">
                    Oder wische links/rechts
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* Enhanced swipe indicator */}
      {isFlipped && !isMultipleChoice && swipeEnabled && (
        <SwipeIndicator 
          dragDelta={swipeState.dragDelta} 
          swipeThreshold={100} 
        />
      )}
    </div>
  );
}
