
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Question } from '@/types/questions';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useVisualFeedback } from '@/hooks/useVisualFeedback';
import { CardConfig, CardEventHandlers } from '@/types/flashcard';
import UnifiedCard from '@/components/flashcard/unified/UnifiedCard';

interface EnhancedCardStackProps {
  questions: Question[];
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  className?: string;
}

interface SwipeDirection {
  direction: 'left' | 'right' | null;
  confidence: number;
}

export default function EnhancedCardStack({
  questions,
  onAnswer,
  onComplete,
  currentIndex,
  setCurrentIndex,
  className = ''
}: EnhancedCardStackProps) {
  const { regulationPreference } = useUserPreferences();
  const { medium: triggerMediumHaptic, light: triggerLightHaptic } = useHapticFeedback();
  const { showFeedback } = useVisualFeedback();
  
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>({ direction: null, confidence: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Preload next few images for smooth experience
  useEffect(() => {
    const preloadImages = async () => {
      for (let i = 1; i <= 3; i++) {
        const preloadIndex = currentIndex + i;
        if (preloadIndex < questions.length && questions[preloadIndex]?.image_url) {
          const img = new Image();
          img.src = questions[preloadIndex].image_url;
        }
      }
    };
    preloadImages();
  }, [currentIndex, questions]);

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    const threshold = 100;
    const confidence = Math.min(Math.abs(info.offset.x) / threshold, 1);
    
    if (Math.abs(info.offset.x) > 20) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setSwipeDirection({ direction, confidence });
      
      // Haptic feedback for direction indication
      if (confidence > 0.5) {
        triggerLightHaptic();
      }
    } else {
      setSwipeDirection({ direction: null, confidence: 0 });
    }
  }, [triggerLightHaptic]);

  const handleDragEnd = useCallback(async (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Determine if swipe should trigger action
    const shouldTrigger = Math.abs(offset) > threshold || Math.abs(velocity) > 500;
    
    if (shouldTrigger && currentIndex < questions.length) {
      setIsAnimating(true);
      const direction = offset > 0 ? 'right' : 'left';
      const score = direction === 'right' ? 5 : 1;
      
      // Strong haptic feedback for action
      triggerMediumHaptic();
      
      // Visual feedback on card element
      if (cardRef.current) {
        showFeedback(cardRef.current, {
          type: direction === 'right' ? 'success' : 'error',
          intensity: 'medium',
          duration: 300
        });
      }
      
      // Submit answer
      await onAnswer(questions[currentIndex].id, score);
      
      // Move to next card or complete
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onComplete();
        }
        setIsAnimating(false);
        setSwipeDirection({ direction: null, confidence: 0 });
      }, 300);
    } else {
      // Reset position
      setSwipeDirection({ direction: null, confidence: 0 });
    }
  }, [currentIndex, questions, onAnswer, setCurrentIndex, onComplete, triggerMediumHaptic, showFeedback]);

  if (questions.length === 0 || currentIndex >= questions.length) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-500">
          <p>Keine Karten verfügbar</p>
        </div>
      </div>
    );
  }

  const currentCard = questions[currentIndex];
  const nextCard = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;
  const hasNextCard = nextCard !== null;

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
    onAnswer: async (score: number) => {
      setIsAnimating(true);
      triggerMediumHaptic();
      
      // Visual feedback on card element
      if (cardRef.current) {
        showFeedback(cardRef.current, {
          type: score >= 4 ? 'success' : 'error',
          intensity: 'medium',
          duration: 300
        });
      }
      
      await onAnswer(currentCard.id, score);
      
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onComplete();
        }
        setIsAnimating(false);
      }, 300);
    },
    onNext: () => {}
  };

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} ref={constraintsRef}>
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200/50 z-20">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Card counter */}
      <div className="absolute top-4 right-4 z-20 bg-black/10 backdrop-blur-lg rounded-full px-3 py-1 text-sm text-gray-700">
        {currentIndex + 1}/{questions.length}
      </div>

      {/* Swipe hints */}
      <div className="absolute bottom-8 left-4 right-4 z-20 flex justify-between items-center">
        <div className={`flex items-center text-sm transition-opacity duration-200 ${
          swipeDirection.direction === 'left' ? 'opacity-100' : 'opacity-50'
        }`}>
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <span className="text-red-600 font-medium">Nicht gewusst</span>
        </div>
        <div className={`flex items-center text-sm transition-opacity duration-200 ${
          swipeDirection.direction === 'right' ? 'opacity-100' : 'opacity-50'
        }`}>
          <span className="text-green-600 font-medium">Gewusst</span>
          <div className="w-3 h-3 rounded-full bg-green-500 ml-2" />
        </div>
      </div>

      {/* Card stack */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pt-12 pb-20">
        <AnimatePresence mode="popLayout">
          {/* Next card (background) */}
          {hasNextCard && !isAnimating && (
            <motion.div
              key={`next-${nextCard.id}`}
              className="absolute"
              initial={{ scale: 0.9, y: 8, opacity: 0.6 }}
              animate={{ scale: 0.95, y: 4, opacity: 0.8 }}
              exit={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pointer-events-none filter blur-[0.5px]">
                <UnifiedCard
                  config={{
                    ...cardConfig,
                    question: nextCard
                  }}
                  handlers={cardHandlers}
                  className="w-[85vw] max-w-sm aspect-[3/4]"
                />
              </div>
            </motion.div>
          )}

          {/* Current card (foreground) */}
          <motion.div
            ref={cardRef}
            key={`current-${currentCard.id}`}
            drag={!isAnimating}
            dragConstraints={constraintsRef}
            dragElastic={0.2}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={{
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 1,
              scale: 1
            }}
            exit={{
              x: swipeDirection.direction === 'left' ? -window.innerWidth : window.innerWidth,
              rotate: swipeDirection.direction === 'left' ? -30 : 30,
              opacity: 0,
              scale: 0.8
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              rotate: swipeDirection.direction 
                ? (swipeDirection.direction === 'left' ? -swipeDirection.confidence * 10 : swipeDirection.confidence * 10)
                : 0
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <UnifiedCard
              config={cardConfig}
              handlers={cardHandlers}
              className="w-[90vw] max-w-sm aspect-[3/4] shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
