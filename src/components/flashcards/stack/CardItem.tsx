
import React, { useState } from 'react';
import { Question } from '@/types/questions';
import { motion } from 'framer-motion';
import CardFront from './CardFront';
import CardBack from './CardBack';
import SwipeHint from './SwipeHint';
import useCardSwipe from './useCardSwipe';
import { useIsMobile } from '@/hooks/use-mobile';

interface CardItemProps {
  question: Question;
  onSwipe?: (direction: 'left' | 'right') => void;
  isPreview?: boolean;
  swipeDisabled?: boolean;
}

export default function CardItem({ 
  question, 
  onSwipe, 
  isPreview = false,
  swipeDisabled = false 
}: CardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    cardRef,
    swipeDirection,
    dragState,
    handlers
  } = useCardSwipe({
    onSwipeLeft: () => onSwipe?.('left'),
    onSwipeRight: () => onSwipe?.('right'),
    disabled: swipeDisabled || isPreview || !isFlipped, // Only enable swipe when showing answer
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
    onSwipe?.(known ? 'right' : 'left');
  };

  const bgColor = swipeDirection === 'right' 
    ? 'rgba(209, 250, 229, 0.6)' // Green tint for right swipe
    : swipeDirection === 'left' 
      ? 'rgba(254, 226, 226, 0.6)' // Red tint for left swipe
      : 'white';

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
      {...(isMobile && !isPreview && !swipeDisabled ? handlers : {})}
    >
      <div className="w-full h-full relative overflow-hidden rounded-2xl" style={{ perspective: '1000px' }}>
        {/* Front card face */}
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
        
        {/* Back card face */}
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
      
      {/* Show swipe hints for mobile only */}
      {isFlipped && !isPreview && isMobile && (
        <SwipeHint
          direction={swipeDirection}
          dragDelta={dragState.dragDelta}
        />
      )}
    </motion.div>
  );
}
