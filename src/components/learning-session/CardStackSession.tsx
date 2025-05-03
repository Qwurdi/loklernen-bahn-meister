
import CardStack from "@/components/flashcards/stack/CardStack";
import { Question } from "@/types/questions";
import { useEffect } from "react";

interface CardStackSessionProps {
  sessionCards: Question[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  isMobile: boolean;
}

export default function CardStackSession({
  sessionCards,
  currentIndex,
  setCurrentIndex,
  onAnswer,
  onComplete,
  isMobile
}: CardStackSessionProps) {
  // Prevent scrolling on mobile devices
  useEffect(() => {
    if (!isMobile) return;
    
    // Save the original style to restore it later
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
    
    // Cleanup function to restore original style
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.classList.remove('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
    };
  }, [isMobile]);
  
  return (
    <div className="h-full w-full flex-1 flex flex-col">
      <CardStack 
        questions={sessionCards}
        onAnswer={onAnswer}
        onComplete={onComplete}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
