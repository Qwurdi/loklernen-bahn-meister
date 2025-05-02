
import React, { useState, useRef, useEffect } from "react";
import { Question } from "@/types/questions";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FlashcardActionButton from "./FlashcardActionButton";

interface FlashcardItemMobileProps {
  question: Question;
  flipped: boolean;
  answered: boolean;
  onShowAnswer: () => void;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function FlashcardItemMobile({ 
  question, 
  flipped, 
  answered,
  onShowAnswer,
  onKnown,
  onNotKnown
}: FlashcardItemMobileProps) {
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Constants for swipe behavior
  const SWIPE_THRESHOLD = 70; // Lower threshold for easier swiping
  const VERTICAL_DEADZONE = 20; // Pixels of vertical movement to still consider a horizontal swipe
  const MAX_ROTATION = 15; // Maximum rotation in degrees
  
  // Touch handling for swipe gestures with improved mechanics
  const handleTouchStart = (e: React.TouchEvent) => {
    if (answered) return;
    
    // Always capture start position, even if not flipped
    setDragStartX(e.touches[0].clientX);
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
    setSwipeDirection(null);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null || answered) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - dragStartX;
    const deltaY = Math.abs(currentY - (dragStartY || 0));
    
    // Check if more vertical than horizontal movement (scrolling attempt)
    if (deltaY > VERTICAL_DEADZONE && !isDragging) {
      return; // Let the page scroll
    }
    
    // Prevent page scrolling while swiping horizontally
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
    
    // Only allow swiping while flipped (looking at answer)
    if (flipped) {
      setDragDelta(deltaX);
      setSwipeDirection(deltaX > 0 ? "right" : "left");
    }
  };
  
  const handleTouchEnd = () => {
    if (dragStartX === null || answered) return;
    
    // Only process swipe actions if card is flipped
    if (flipped) {
      const threshold = SWIPE_THRESHOLD;
      
      if (dragDelta > threshold) {
        // Swipe right = known, add animation before callback
        setSwipeDirection("right");
        animateSwipe("right");
        setTimeout(() => onKnown(), 150);
      } else if (dragDelta < -threshold) {
        // Swipe left = not known, add animation before callback
        setSwipeDirection("left");
        animateSwipe("left");
        setTimeout(() => onNotKnown(), 150);
      }
    }
    
    // Reset
    setDragStartX(null);
    setDragStartY(null);
    setDragDelta(0);
    setIsDragging(false);
  };

  // Add effect for vibration feedback on significant drag
  useEffect(() => {
    if (Math.abs(dragDelta) > SWIPE_THRESHOLD / 2 && navigator.vibrate) {
      navigator.vibrate(10); // subtle haptic feedback
    }
  }, [dragDelta]);

  // Function to animate card flying away
  const animateSwipe = (direction: "left" | "right") => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
    cardRef.current.style.transform = `translateX(${direction === "right" ? 150 : -150}%) rotate(${direction === "right" ? 10 : -10}deg)`;
    cardRef.current.style.opacity = "0";
  };

  // Calculate card styles during drag
  const getCardStyle = () => {
    if (dragDelta === 0) {
      return {
        transform: "none",
        transition: isDragging ? "none" : "transform 0.3s ease-out, background-color 0.2s ease"
      };
    }
    
    // Calculate rotation based on drag distance, capped at MAX_ROTATION degrees
    const rotation = Math.min(Math.abs(dragDelta) * 0.1, MAX_ROTATION) * (dragDelta > 0 ? 1 : -1);
    
    // Calculate background color based on drag direction and distance
    const dragPercentage = Math.min(Math.abs(dragDelta) / SWIPE_THRESHOLD, 1); 
    const backgroundColor = dragDelta > 0 
      ? `rgba(209, 250, 229, ${dragPercentage * 0.9})` 
      : `rgba(254, 226, 226, ${dragPercentage * 0.9})`;
    
    return {
      transform: `translateX(${dragDelta * 1.2}px) rotate(${rotation}deg)`,
      backgroundColor,
      transition: isDragging ? "none" : "transform 0.3s ease-out, background-color 0.2s ease"
    };
  };

  // Get appropriate card classes
  const getCardClasses = () => {
    return `relative p-4 min-h-[calc(100vh-230px)] flex flex-col bg-white rounded-xl shadow-md touch-none ${
      swipeDirection === "right" ? "animate-swipe-right" : 
      swipeDirection === "left" ? "animate-swipe-left" : ""
    }`;
  };

  return (
    <div className="mx-auto w-full relative touch-none">
      <Card 
        ref={cardRef}
        className={getCardClasses()}
        style={getCardStyle()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!flipped ? (
          <div className="flex flex-col h-full">
            <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-500 self-start mb-2">Signal</div>
            <h2 className="text-lg font-medium mb-4">{question?.text}</h2>
            <div className="flex-1 flex items-center justify-center py-8">
              {question?.image_url && (
                <img 
                  src={question.image_url} 
                  alt="Signal" 
                  className="max-h-[240px] max-w-full object-contain"
                />
              )}
            </div>
            <Button 
              className="w-full py-6 mt-auto bg-loklernen-sapphire text-white hover:bg-loklernen-sapphire/90"
              onClick={onShowAnswer}
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Signal anzeigen
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-2">Antwort</div>
            
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="flex flex-col items-center w-full pb-16"> {/* Add padding to make room for buttons */}
                {question?.image_url && (
                  <img 
                    src={question.image_url} 
                    alt="Signal" 
                    className="max-h-[160px] object-contain mb-6"
                  />
                )}
                
                <div className="bg-blue-50 p-5 rounded-xl w-full shadow-sm border border-blue-100 mb-8">
                  {question.category === "Signale" ? (
                    <div className="space-y-3">
                      {question.answers[0].text.split('\n').map((line, i) => (
                        <p key={i} className="font-bold text-lg text-blue-800">
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="font-medium text-lg text-blue-800">
                      {question?.answers[0].text}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Floating action buttons */}
            {!answered && (
              <div className="absolute left-0 right-0 bottom-4 flex justify-center items-center space-x-6">
                <div className="text-xs text-gray-500 absolute -top-5 w-full text-center">
                  Nach links wischen = Nicht gewusst | Nach rechts = Gewusst
                </div>
                <FlashcardActionButton
                  variant="unknown"
                  onClick={onNotKnown}
                  isMobile={true}
                />
                <FlashcardActionButton
                  variant="known"
                  onClick={onKnown}
                  isMobile={true}
                />
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Visual swipe direction indicator overlay */}
      {flipped && dragDelta !== 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div 
            className={`text-4xl font-bold transition-opacity ${
              Math.abs(dragDelta) < 30 ? 'opacity-0' : 'opacity-70'
            } ${
              dragDelta > 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {dragDelta > 0 ? 'Gewusst' : 'Nicht gewusst'}
          </div>
        </div>
      )}
    </div>
  );
}
