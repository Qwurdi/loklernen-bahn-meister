
import React, { useState } from 'react';
import { Question } from '@/types/questions';
import { motion, AnimatePresence } from 'framer-motion';
import { RegulationFilterType } from '@/types/regulation';
import ExpressiveCardFront from './ExpressiveCardFront';
import ExpressiveCardBack from './ExpressiveCardBack';

interface ExpressiveCardProps {
  question: Question;
  onAnswer: (score: number) => void;
  regulationPreference: RegulationFilterType;
}

export default function ExpressiveCard({
  question,
  onAnswer,
  regulationPreference
}: ExpressiveCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleShowAnswer = () => {
    setIsFlipped(true);
  };

  const handleAnswer = (score: number) => {
    setIsAnswered(true);
    onAnswer(score);
    
    // Reset for next question
    setTimeout(() => {
      setIsFlipped(false);
      setIsAnswered(false);
    }, 1000);
  };

  return (
    <div className="perspective-1000 w-full max-w-2xl">
      <motion.div
        className="relative w-full h-[600px] preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Front side */}
        <div className="absolute inset-0 backface-hidden">
          <ExpressiveCardFront
            question={question}
            regulationPreference={regulationPreference}
            onShowAnswer={handleShowAnswer}
          />
        </div>

        {/* Back side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <ExpressiveCardBack
            question={question}
            regulationPreference={regulationPreference}
            onAnswer={handleAnswer}
            isAnswered={isAnswered}
          />
        </div>
      </motion.div>
    </div>
  );
}
