
import React from "react";
import { Question } from "@/types/questions";
import { Card } from "@/components/ui/card";
import { useSwipe } from "./mobile/useSwipe";
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
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Use our consolidated swipe hook
  const { 
    cardRef, 
    swipeState, 
    handlers, 
    getCardStyle, 
    getCardClasses 
  } = useSwipe({
    onSwipeLeft: onNotKnown,
    onSwipeRight: onKnown,
    onShowAnswer,
    isFlipped: flipped,
    isAnswered: answered,
    disableSwipe: isMultipleChoice && flipped // Disable swipe for MC questions when the card is flipped
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

      {/* Visual swipe indicator overlay - only for non-MC questions or front side */}
      {(!isMultipleChoice || !flipped) && (
        <SwipeIndicator 
          dragDelta={swipeState.dragDelta} 
          swipeThreshold={100} 
        />
      )}
    </div>
  );
}
