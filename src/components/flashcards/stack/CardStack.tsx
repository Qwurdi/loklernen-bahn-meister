
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Question } from '@/types/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import UnifiedCard from '@/components/flashcard/unified/UnifiedCard';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';
import EmptyStackMessage from './EmptyStackMessage';
import StackProgress from './StackProgress';

interface CardStackProps<T extends Question = Question> {
  questions: T[];
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function CardStack<T extends Question = Question>({ 
  questions, 
  onAnswer, 
  onComplete,
  currentIndex,
  setCurrentIndex
}: CardStackProps<T>) {
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { regulationPreference } = useUserPreferences();
  const stackRef = useRef<HTMLDivElement>(null);

  // Preload the next few images
  useEffect(() => {
    for (let i = 1; i <= 3; i++) {
      const preloadIndex = currentIndex + i;
      if (preloadIndex < questions.length) {
        const nextQuestion = questions[preloadIndex];
        if (nextQuestion.image_url) {
          const img = new Image();
          img.src = nextQuestion.image_url;
        }
      }
    }
  }, [currentIndex, questions]);

  const handleAnswer = useCallback(async (score: number) => {
    if (isAnimating || currentIndex >= questions.length) return;
    
    setIsAnimating(true);
    setDirection(score >= 4 ? 'right' : 'left');
    
    const currentQuestion = questions[currentIndex];
    
    await onAnswer(currentQuestion.id, score);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete();
      }
      
      setDirection(null);
      setIsAnimating(false);
    }, 300);
  }, [currentIndex, questions, onAnswer, onComplete, setCurrentIndex, isAnimating]);

  if (questions.length === 0) {
    return <EmptyStackMessage />;
  }

  if (currentIndex >= questions.length) {
    return <EmptyStackMessage isCompleted={true} />;
  }

  const currentCard = questions[currentIndex];
  const hasNextCard = currentIndex < questions.length - 1;
  const nextCard = hasNextCard ? questions[currentIndex + 1] : null;
  
  const cardConfig: CardConfig = {
    question: currentCard,
    regulationPreference,
    displayMode: 'stack',
    interactionMode: 'swipe',
    enableSwipe: true,
    enableKeyboard: false,
    showHints: true,
    autoFlip: false
  };

  const cardHandlers: CardEventHandlers = {
    onFlip: () => {},
    onAnswer: handleAnswer,
    onNext: () => {}
  };

  return (
    <div className="stack-container h-full w-full relative overflow-hidden" ref={stackRef}>
      <StackProgress 
        total={questions.length} 
        current={currentIndex + 1} 
        className="absolute top-0 left-0 right-0 z-10" 
      />
      
      <div className="cards-wrapper h-full w-full flex items-center justify-center pt-8 pb-16">
        <AnimatePresence mode="popLayout">
          {/* Next card in stack */}
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
                <UnifiedCard 
                  config={{
                    ...cardConfig,
                    question: nextCard
                  }}
                  handlers={cardHandlers}
                  className="w-[90vw] max-w-md aspect-[3/4]"
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
            <UnifiedCard 
              config={cardConfig}
              handlers={cardHandlers}
              className="w-[90vw] max-w-md aspect-[3/4]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
