
import React from 'react';
import { Question } from '@/types/questions';

interface CardStackSessionProps<T> {
  onNext: () => void;
  onComplete: () => void;
}

const CardStackSession = ({
  onNext,
  onComplete,
}: CardStackSessionProps<Question>) => {
  // Placeholder implementation - will need to be expanded with actual functionality
  return (
    <div className="card-stack-session">
      <button onClick={onNext} className="text-blue-500">Next card</button>
      <button onClick={onComplete} className="text-green-500 ml-4">Complete session</button>
    </div>
  );
};

export default CardStackSession;
