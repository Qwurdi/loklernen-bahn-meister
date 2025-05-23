
import React, { useState } from 'react';
import { Question } from '@/types/questions';
import { motion } from 'framer-motion';
import CardFront from './CardFront';
import CardBack from './CardBack';
import SwipeHint from './SwipeHint';
import useCardSwipe from './useCardSwipe';
import { useIsMobile } from '@/hooks/use-mobile';

// Update interface to use generics
interface CardItemProps<T extends Question = Question> {
  question: T;
  onSwipe?: (direction: 'left' | 'right') => void;
  isPreview?: boolean;
  swipeDisabled?: boolean;
}

// Add generic type parameter to the component
export default function CardItem<T extends Question = Question>({ 
  question, 
  onSwipe, 
  isPreview = false,
  swipeDisabled = false 
}: CardItemProps<T>) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isMobile = useIsMobile();
  const isMultipleChoice = question.question_type === 'MC_single' || question.question_type === 'MC_multi';
  
  const {
    cardRef,
    swipeDirection,
    dragState,
    handlers
  } = useCardSwipe({
    onSwipeLeft: () => onSwipe?.('left'),
    onSwipeRight: () => onSwipe?.('right'),
    disabled: swipeDisabled || isPreview || !isFlipped || isMultipleChoice, // Disable swipe for MC questions
    dragThreshold: 80
  });

  // Only allow flipping the card on the front side
  const handleCardTap = () => {
    if (!isPreview && !swipeDisabled && !isFlipped) {
      setIsFlipped(true);
    }
  };

  // Handle button answers (desktop only)
  const handleAnswer = (known: boolean) => {
    if (isPreview || swipeDisabled) return;
    
    // For multiple choice questions, the correctness has already been determined in MultipleChoiceQuestion
    // Just pass it through to the parent component
    if (isMultipleChoice) {
      onSwipe?.(known ? 'right' : 'left');
      return;
    }
    
    // For open questions, use the swipe mechanism
    onSwipe?.(known ? 'right' : 'left');
  };

  // Enhanced background color feedback
  const bgColor = swipeDirection === 'right' 
    ? 'rgba(220, 252, 231, 0.8)' // Light green for correct
    : swipeDirection === 'left' 
      ? 'rgba(254, 226, 226, 0.8)' // Light red for incorrect
      : 'transparent';

  // Calculate rotation based on drag
  const rotation = dragState.dragDelta * 0.05; // Reduced rotation effect
  
  return (
    <motion.div
      ref={cardRef}
      className={`flashcard-item relative w-[90vw] max-w-md aspect-[3/4] rounded-2xl
                  shadow-lg touch-none transform-gpu ${isPreview ? 'pointer-events-none' : ''}`}
      style={{
        backgroundColor: bgColor,
        WebkitTapHighlightColor: 'transparent'
      }}
      animate={{
        rotate: rotation,
        x: dragState.dragDelta,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onClick={handleCardTap}
      {...(isMobile && !isPreview && !swipeDisabled && !isMultipleChoice ? handlers : {})}
    >
      <div className="w-full h-full relative overflow-hidden rounded-2xl" style={{ perspective: '1000px' }}>
        {/* Front card face with improved animation */}
        <div 
          className="w-full h-full transition-transform duration-500 transform-gpu"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            zIndex: isFlipped ? 0 : 1,
            opacity: isFlipped ? 0 : 1,
            width: '100%',
            height: '100%'
          }}
        >
          <CardFront question={question} />
        </div>
        
        {/* Back card face with improved animation */}
        <div 
          className="w-full h-full transition-transform duration-500 transform-gpu"
          style={{
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            zIndex: isFlipped ? 1 : 0,
            opacity: isFlipped ? 1 : 0,
            width: '100%',
            height: '100%'
          }}
        >
          <CardBack 
            question={question} 
            onAnswer={!isPreview ? handleAnswer : undefined}
          />
        </div>
      </div>
      
      {/* Enhanced swipe hints for mobile - only for open questions */}
      {isFlipped && !isPreview && isMobile && !isMultipleChoice && (
        <SwipeHint
          direction={swipeDirection}
          dragDelta={dragState.dragDelta}
        />
      )}

      {/* Add subtle card shadow effect for depth */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-30"
           style={{
             boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
           }}
      />
    </motion.div>
  );
}
