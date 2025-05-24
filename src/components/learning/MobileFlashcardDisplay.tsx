
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
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";

  // Swipe functionality - only enabled after user has seen the answer
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
    disableSwipe: isMultipleChoice || !swipeEnabled
  });

  function handleShowAnswer() {
    setIsFlipped(true);
    
    // Enable swipe after a short delay to prevent accidental swipes
    if (!isMultipleChoice) {
      setTimeout(() => {
        setSwipeEnabled(true);
      }, 1000); // 1 second delay before swipe is enabled
    }
  }

  function handleAnswer(score: number) {
    if (isAnswered) return; // Prevent double answers
    
    setIsAnswered(true);
    setSwipeEnabled(false); // Disable further swipes
    onAnswer(score);
  }

  return (
    <div className={`h-full w-full touch-none ${className}`}>
      <div 
        ref={cardRef}
        className={`w-full h-full bg-white rounded-xl shadow-lg relative overflow-hidden ${getCardClasses()}`}
        style={getCardStyle()}
        onClick={!isFlipped ? handleShowAnswer : undefined}
        onTouchStart={isFlipped && swipeEnabled ? handlers.handleTouchStart : undefined}
        onTouchMove={isFlipped && swipeEnabled ? handlers.handleTouchMove : undefined}
        onTouchEnd={isFlipped && swipeEnabled ? handlers.handleTouchEnd : undefined}
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

      {/* Swipe indicator for non-MC questions - only show when swipe is enabled */}
      {isFlipped && !isMultipleChoice && swipeEnabled && (
        <SwipeIndicator 
          dragDelta={swipeState.dragDelta} 
          swipeThreshold={100} 
        />
      )}
      
      {/* Subtle hint when answer is first shown */}
      {isFlipped && !isMultipleChoice && !swipeEnabled && !isAnswered && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
          Wische in 1 Sekunde verfügbar
        </div>
      )}
    </div>
  );
}
