
import React from "react";
import { Question } from "@/types/questions";
import { Card } from "@/components/ui/card";
import { useCardSwipe, SWIPE_THRESHOLD } from "./mobile/useCardSwipe";
import QuestionSide from "./mobile/QuestionSide";
import AnswerSide from "./mobile/AnswerSide";
import SwipeIndicator from "./mobile/SwipeIndicator";

interface FlashcardItemMobileProps {
  question: Question;
  flipped: boolean;
  answered: boolean;
  onShowAnswer: () => void;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function FlashcardItemMobile({ 
  question, 
  flipped, 
  answered,
  onShowAnswer,
  onKnown,
  onNotKnown
}: FlashcardItemMobileProps) {
  // Use our custom hook for swipe behavior
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
    isFlipped: flipped,
    isAnswered: answered
  });

  return (
    <div className="mx-auto w-full relative touch-none">
      <Card 
        ref={cardRef}
        className={getCardClasses()}
        style={getCardStyle()}
        onTouchStart={handlers.handleTouchStart}
        onTouchMove={handlers.handleTouchMove}
        onTouchEnd={handlers.handleTouchEnd}
      >
        {!flipped ? (
          <QuestionSide 
            question={question} 
            onShowAnswer={onShowAnswer} 
          />
        ) : (
          <AnswerSide 
            question={question} 
            answered={answered} 
            onKnown={onKnown} 
            onNotKnown={onNotKnown} 
          />
        )}
      </Card>

      {/* Visual swipe indicator overlay */}
      <SwipeIndicator 
        dragDelta={swipeState.dragDelta} 
        swipeThreshold={SWIPE_THRESHOLD} 
      />
    </div>
  );
}
