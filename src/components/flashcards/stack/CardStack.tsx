
import React, { useState, useRef, useCallback } from 'react';
import { Question } from '@/types/questions';
import { motion, AnimatePresence } from 'framer-motion';
import CardItem from './CardItem';
import EmptyStackMessage from './EmptyStackMessage';
import StackProgress from './StackProgress';

interface CardStackProps {
  questions: Question[];
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function CardStack({ 
  questions, 
  onAnswer, 
  onComplete,
  currentIndex,
  setCurrentIndex
}: CardStackProps) {
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (isAnimating || currentIndex >= questions.length) return;
    
    setIsAnimating(true);
    setDirection(direction);
    
    const currentQuestion = questions[currentIndex];
    const score = direction === 'right' ? 5 : 1; // Right = known (5), Left = not known (1)
    
    // Process the answer
    await onAnswer(currentQuestion.id, score);
    
    // Short delay to let animation complete
    setTimeout(() => {
      // Move to next question or complete session
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete();
      }
      
      // Reset animation state
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  }, [currentIndex, questions, onAnswer, onComplete, setCurrentIndex, isAnimating]);

  // If no questions are available
  if (questions.length === 0) {
    return <EmptyStackMessage />;
  }

  // If we've reached the end of the stack
  if (currentIndex >= questions.length) {
    return <EmptyStackMessage isCompleted={true} />;
  }

  const currentCard = questions[currentIndex];
  const hasNextCard = currentIndex < questions.length - 1;
  const nextCard = hasNextCard ? questions[currentIndex + 1] : null;
  
  return (
    <div className="stack-container h-full w-full relative overflow-hidden" ref={stackRef}>
      <StackProgress 
        total={questions.length} 
        current={currentIndex + 1} 
        className="absolute top-0 left-0 right-0 z-10" 
      />
      
      <div className="cards-wrapper h-full w-full flex items-center justify-center pt-8 pb-16">
        <AnimatePresence mode="popLayout">
          {/* Next card in stack (shown partially underneath) */}
          {hasNextCard && !isAnimating && (
            <motion.div 
              key={`next-${nextCard.id}`}
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
            key={`card-${currentCard.id}`}
            animate={direction === 'left' 
              ? { x: -window.innerWidth * 1.5, rotate: -20, opacity: 0 } 
              : direction === 'right' 
                ? { x: window.innerWidth * 1.5, rotate: 20, opacity: 0 } 
                : { x: 0, rotate: 0, opacity: 1 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <CardItem 
              question={currentCard}
              onSwipe={handleSwipe}
              swipeDisabled={isAnimating}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
