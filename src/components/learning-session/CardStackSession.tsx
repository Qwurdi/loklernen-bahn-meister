
import { useRef, useEffect, memo } from 'react';
import CardStack from "@/components/flashcards/stack/CardStack";
import { Question } from "@/types/questions";
import { useMobileFullscreen } from "@/hooks/use-mobile-fullscreen";

// Define a generic type parameter T that extends Question
interface CardStackSessionProps<T extends Question = Question> {
  sessionCards: T[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onAnswer: (questionId: string, score: number) => Promise<void>;
  onComplete: () => void;
  isMobile: boolean;
}

/**
 * Optimized CardStackSession component with rendering performance improvements
 */
function CardStackSession<T extends Question = Question>({
  sessionCards,
  currentIndex,
  setCurrentIndex,
  onAnswer,
  onComplete,
  isMobile
}: CardStackSessionProps<T>) {
  // Track mounted state to prevent memory leaks
  const isMounted = useRef(true);
  
  // Use our centralized mobile fullscreen hook
  const { isFullscreenMobile, toggleFullscreen } = useMobileFullscreen(false);
  
  // Enable fullscreen mode when component mounts on mobile
  useEffect(() => {
    if (isMobile && !isFullscreenMobile) {
      toggleFullscreen();
    }
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted.current = false;
      
      // Exit fullscreen when component unmounts if we're in fullscreen
      if (isMobile && isFullscreenMobile) {
        toggleFullscreen();
      }
    };
  }, [isMobile, isFullscreenMobile, toggleFullscreen]);
  
  return (
    <div className="h-full w-full flex-1 flex flex-col transform-gpu">
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

// Export as memoized component to avoid unnecessary re-renders
export default memo(CardStackSession) as typeof CardStackSession;
