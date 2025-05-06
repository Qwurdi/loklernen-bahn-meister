
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardItem from './CardItem';
import { Question } from '@/types/questions';

interface CardAnimationProps<T extends Question = Question> {
  currentCard: T;
  nextCard: T | null;
  direction: 'left' | 'right' | null;
  isAnimating: boolean;
  hasNextCard: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  swipeDisabled: boolean;
}

const CardAnimation = <T extends Question = Question>({
  currentCard,
  nextCard,
  direction,
  isAnimating,
  hasNextCard,
  onSwipe,
  swipeDisabled
}: CardAnimationProps<T>) => {
  return (
    <AnimatePresence mode="wait">
      {/* Next card in stack (shown partially underneath) */}
      {hasNextCard && !isAnimating && nextCard && (
        <motion.div 
          key={`next-${nextCard.id || 'fallback-next'}`}
          className="absolute"
          initial={{ scale: 0.85, y: 16, opacity: 0.6 }}
          animate={{ scale: 0.9, y: 12, opacity: 0.8 }}
          exit={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="opacity-60 pointer-events-none">
            <CardItem 
              question={nextCard}
              isPreview={true}
            />
          </div>
        </motion.div>
      )}
      
      {/* Current active card */}
      <motion.div
        key={`card-${currentCard.id || 'fallback-current'}`}
        animate={direction === 'left' 
          ? { x: -window.innerWidth * 1.5, rotate: -20, opacity: 0 } 
          : direction === 'right' 
            ? { x: window.innerWidth * 1.5, rotate: 20, opacity: 0 } 
            : { x: 0, rotate: 0, opacity: 1 }
        }
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          duration: 0.3
        }}
        className="hardware-accelerated"
      >
        <CardItem 
          question={currentCard}
          onSwipe={onSwipe}
          swipeDisabled={swipeDisabled}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default CardAnimation;
