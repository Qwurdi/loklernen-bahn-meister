
import React from 'react';
import { Link } from 'react-router-dom';
import { Question } from '@/types/questions';
import FlashcardQuestionImage from '@/components/flashcards/FlashcardQuestionImage';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
  return (
    <Link 
      to={`/karteikarten/lernen?questionId=${card.question_id}`} 
      className="shrink-0"
    >
      <div 
        className={`w-20 h-20 transition-all rounded-lg border ${
          isHovered ? 
          'border-loklernen-ultramarine shadow-md shadow-loklernen-ultramarine/20 bg-black/40' : 
          'border-white/10 bg-black/20'
        } backdrop-blur-md hover:translate-y-[-2px]`}
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
            <div className="text-xs line-clamp-2 overflow-hidden text-center text-gray-300">
              {question.text.length > 30 ? `${question.text.substring(0, 30)}...` : question.text}
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
