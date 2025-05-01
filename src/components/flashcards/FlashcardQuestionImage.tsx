
import React from "react";

interface FlashcardQuestionImageProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
}

export default function FlashcardQuestionImage({
  imageUrl,
  alt = "Signal",
  className = "max-h-[200px] max-w-full object-contain"
}: FlashcardQuestionImageProps) {
  if (!imageUrl) return null;
  
  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
    />
  );
}
