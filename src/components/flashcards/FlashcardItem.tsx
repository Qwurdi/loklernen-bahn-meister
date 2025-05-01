
import React, { useState, useEffect } from "react";
import { Question } from "@/types/questions";
import { useIsMobile } from "@/hooks/use-mobile";
import FlashcardItemMobile from "./FlashcardItemMobile";
import FlashcardItemDesktop from "./FlashcardItemDesktop";

interface FlashcardItemProps {
  question: Question;
  onAnswer: (score: number) => void;
  onNext: () => void;
  showAnswer?: boolean;
}

export default function FlashcardItem({ 
  question, 
  onAnswer, 
  onNext,
  showAnswer = false
}: FlashcardItemProps) {
  const [flipped, setFlipped] = useState(showAnswer);
  const [answered, setAnswered] = useState(false);
  const isMobile = useIsMobile();

  // Reset state when question changes
  useEffect(() => {
    setFlipped(showAnswer);
    setAnswered(false);
  }, [question, showAnswer]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flipped && !answered) {
        if (e.key === "ArrowLeft" || e.key === "n" || e.key === "N") {
          handleNotKnown();
        } else if (e.key === "ArrowRight" || e.key === "y" || e.key === "Y") {
          handleKnown();
        }
      } else if (!flipped) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleShowAnswer();
        }
      }
    };

    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [flipped, answered, question, isMobile]);

  const handleShowAnswer = () => {
    setFlipped(true);
  };
  
  const handleKnown = () => {
    setAnswered(true);
    onAnswer(5); // Score 5 for "Gewusst"
    
    // Small delay to see the selection before moving on
    setTimeout(() => {
      onNext();
    }, 300);
  };
  
  const handleNotKnown = () => {
    setAnswered(true);
    onAnswer(1); // Score 1 for "Nicht gewusst" (resets the card)
    
    // Small delay to see the selection before moving on
    setTimeout(() => {
      onNext();
    }, 300);
  };
  
  // Render the appropriate component based on device type
  if (isMobile) {
    return (
      <FlashcardItemMobile 
        question={question}
        flipped={flipped}
        answered={answered}
        onShowAnswer={handleShowAnswer}
        onKnown={handleKnown}
        onNotKnown={handleNotKnown}
      />
    );
  }
  
  return (
    <FlashcardItemDesktop
      question={question}
      flipped={flipped}
      answered={answered}
      onShowAnswer={handleShowAnswer}
      onKnown={handleKnown}
      onNotKnown={handleNotKnown}
    />
  );
}
