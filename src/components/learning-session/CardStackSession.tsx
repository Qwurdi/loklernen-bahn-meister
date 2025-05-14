
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
  // Improved handling for mobile view
  useEffect(() => {
    if (!isMobile) return;
    
    // Save the original styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlPosition = document.documentElement.style.position;
    
    // Set CSS variable for actual viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Prevent scrolling on body and html
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.height = '100%';
    document.documentElement.style.width = '100%';
    
    const handleResize = () => {
      // Update vh variable on resize/orientation change
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function to restore original style
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.position = originalHtmlPosition;
      document.documentElement.style.removeProperty('height');
      document.documentElement.style.removeProperty('width');
      document.documentElement.style.removeProperty('--vh');
      window.removeEventListener('resize', handleResize);
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
