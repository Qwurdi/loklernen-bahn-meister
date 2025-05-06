
import React, { useState, useRef, useCallback, memo } from 'react';
import { Question } from '@/types/questions';
import EmptyStackMessage from './EmptyStackMessage';
import StackProgress from './StackProgress';
import { useImagePreloader } from './useImagePreloader';
import CardAnimation from './CardAnimation';

// Update interface to use generics
interface CardStackProps<T extends Question = Question> {
  questions: T[];
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

// Add the generic type parameter to the component
const CardStack = <T extends Question = Question>({ 
  questions, 
  onAnswer, 
  onComplete,
  currentIndex,
  setCurrentIndex
}: CardStackProps<T>) => {
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  
  // Use custom hook for image preloading
  const { animationTimeoutRef } = useImagePreloader(questions, currentIndex);

  // Memoize handleSwipe to prevent unnecessary recreation
  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (isAnimating || currentIndex >= questions.length) return;
    
    setIsAnimating(true);
    setDirection(direction);
    
    const currentQuestion = questions[currentIndex];
    
    // Safety check for missing ID
    if (!currentQuestion || !currentQuestion.id) {
      console.error("Invalid question data", currentQuestion);
      setIsAnimating(false);
      setDirection(null);
      return;
    }
    
    const score = direction === 'right' ? 5 : 1; // Right = known (5), Left = not known (1)
    
    try {
      // Process the answer - using optimized submitAnswer that doesn't reload
      await onAnswer(currentQuestion.id, score);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
    
    // Short delay to let animation complete
    animationTimeoutRef.current = window.setTimeout(() => {
      // Move to next question or complete session
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete();
      }
      
      // Reset animation state
      setDirection(null);
      setIsAnimating(false);
      animationTimeoutRef.current = null;
    }, 300);
  }, [currentIndex, questions, onAnswer, onComplete, setCurrentIndex, isAnimating, animationTimeoutRef]);

  // If no questions are available
  if (!questions || questions.length === 0) {
    return <EmptyStackMessage />;
  }

  // If we've reached the end of the stack
  if (currentIndex >= questions.length) {
    return <EmptyStackMessage isCompleted={true} />;
  }

  // Check if currentCard exists before proceeding
  const currentCard = questions[currentIndex];
  if (!currentCard) {
    console.error("Missing current card data at index", currentIndex);
    return <EmptyStackMessage />;
  }

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
        <CardAnimation
          currentCard={currentCard}
          nextCard={nextCard}
          direction={direction}
          isAnimating={isAnimating}
          hasNextCard={hasNextCard}
          onSwipe={handleSwipe}
          swipeDisabled={isAnimating}
        />
      </div>
    </div>
  );
};

// Export as memoized component to avoid unnecessary re-renders
export default memo(CardStack) as typeof CardStack;
