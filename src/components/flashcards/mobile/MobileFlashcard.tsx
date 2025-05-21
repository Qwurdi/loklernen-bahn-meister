
import React from 'react';
import { Question } from "@/types/questions";
import { useCardSwipe } from "./swipe/useCardSwipe";
import MobileQuestionSide from "./MobileQuestionSide";
import MobileAnswerSide from "./MobileAnswerSide";
import SwipeIndicator from "./SwipeIndicator";

interface MobileFlashcardProps {
  question: Question;
  isFlipped: boolean;
  isAnswered: boolean;
  onShowAnswer: () => void;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function MobileFlashcard({
  question,
  isFlipped,
  isAnswered,
  onShowAnswer,
  onKnown,
  onNotKnown
}: MobileFlashcardProps) {
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Use our consolidated swipe hook
  const { 
    cardRef, 
    swipeState, 
    handlers, 
    getCardStyle, 
    getCardClasses 
  } = useCardSwipe({
    onSwipeLeft: onNotKnown,
    onSwipeRight: onKnown,
    onShowAnswer,
    isFlipped,
    isAnswered,
    disableSwipe: isMultipleChoice && isFlipped // Disable swipe for MC questions when flipped
  });

  // Handle card click on question side to flip the card
  const handleCardClick = () => {
    if (!isFlipped) {
      onShowAnswer();
    }
  };

  return (
    <div className="w-full h-full px-3 touch-none">
      <div 
        ref={cardRef}
        className={`w-full h-full bg-white rounded-xl shadow-lg relative overflow-hidden ${getCardClasses()}`}
        style={getCardStyle()}
        onClick={!isFlipped ? handleCardClick : undefined}
        onTouchStart={isFlipped ? handlers.handleTouchStart : undefined}
        onTouchMove={isFlipped ? handlers.handleTouchMove : undefined}
        onTouchEnd={isFlipped ? handlers.handleTouchEnd : undefined}
      >
        {!isFlipped ? (
          <MobileQuestionSide 
            question={question} 
            onShowAnswer={onShowAnswer} 
          />
        ) : (
          <MobileAnswerSide 
            question={question} 
            answered={isAnswered} 
            onKnown={onKnown} 
            onNotKnown={onNotKnown} 
          />
        )}
      </div>

      {/* Visual swipe indicator overlay - only show on answer side for non-MC questions */}
      {isFlipped && (!isMultipleChoice || !isFlipped) && (
        <SwipeIndicator 
          dragDelta={swipeState.dragDelta} 
          swipeThreshold={100} 
        />
      )}
    </div>
  );
}
