
import React from 'react';
import { Link } from 'react-router-dom';
import { Question } from '@/types/questions';
import FlashcardQuestionImage from '@/components/flashcards/FlashcardQuestionImage';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getTextValue, getTextSubstring } from '@/types/rich-text';

interface DueCardItemProps {
  card: any;
  question: Question;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function DueCardItem({ 
  card, 
  question, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: DueCardItemProps) {
  const questionText = getTextValue(question.text);
  
  return (
    <Link 
      to={`/karteikarten/lernen?questionId=${card.question_id}`} 
      className="shrink-0"
    >
      <div 
        className={`w-20 h-20 transition-all rounded-lg border ${
          isHovered ? 
          'border-loklernen-ultramarine shadow-md shadow-loklernen-ultramarine/10 bg-white' : 
          'border-gray-200 bg-white'
        } hover:translate-y-[-2px]`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="p-1 overflow-hidden h-full flex flex-col justify-center items-center">
          {question.image_url ? (
            <AspectRatio ratio={1} className="w-16 h-16 overflow-hidden">
              <FlashcardQuestionImage 
                imageUrl={question.image_url}
                className="w-full h-full object-contain"
              />
            </AspectRatio>
          ) : (
            <div className="text-xs line-clamp-2 overflow-hidden text-center text-gray-600">
              {questionText.length > 30 ? getTextSubstring(question.text, 0, 30) + "..." : questionText}
            </div>
          )}
          <div className="mt-auto pt-1 text-[8px] text-gray-400 text-center w-full truncate">
            {question.regulation_category || "Allgemein"}
          </div>
        </div>
      </div>
    </Link>
  );
}
