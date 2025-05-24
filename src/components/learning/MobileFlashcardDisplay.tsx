
import React, { useState } from 'react';
import { Question } from '@/types/questions';
import { useCardSwipe } from '@/components/learning/swipe/useCardSwipe';
import MobileFlashcardQuestionSide from './mobile/MobileFlashcardQuestionSide';
import MobileFlashcardAnswerSide from './mobile/MobileFlashcardAnswerSide';
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
          <MobileFlashcardQuestionSide 
            question={question} 
            onShowAnswer={handleShowAnswer} 
          />
        ) : (
          <MobileFlashcardAnswerSide 
            question={question} 
            isAnswered={isAnswered} 
            onAnswer={handleAnswer} 
          />
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
