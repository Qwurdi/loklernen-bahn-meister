
import CardStack from "@/components/flashcards/stack/CardStack";
import { Question } from "@/types/questions";
import { useEffect } from "react";

// Define a generic type parameter T that extends Question
interface CardStackSessionProps<T extends Question = Question> {
  sessionCards: T[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  isMobile: boolean;
}

// Use the generic type parameter in the component definition
export default function CardStackSession<T extends Question = Question>({
  sessionCards,
  currentIndex,
  setCurrentIndex,
  onAnswer,
  onComplete,
  isMobile
}: CardStackSessionProps<T>) {
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
