
import React from 'react';
import { Question } from '@/types/questions';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { useIsMobile } from '@/hooks/use-mobile';
import FlashcardActionButton from '../FlashcardActionButton';

interface CardBackProps {
  question: Question;
  onAnswer?: (known: boolean) => void;
}

export default function CardBack({ question, onAnswer }: CardBackProps) {
  const correctAnswer = question.answers.find(a => a.isCorrect)?.text || '';
  const isMobile = useIsMobile();
  
  // Dynamic text size for the answer
  const textSizeClass = useDynamicTextSize(correctAnswer, 'answer');
  
  return (
    <div className="w-full h-full bg-gray-900 p-6 flex flex-col rounded-2xl border border-gray-800">
      <div className="bg-loklernen-ultramarine/30 px-3 py-1.5 rounded-full text-xs text-blue-300 self-start mb-2">
        Antwort
      </div>
      
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col items-center w-full py-2">
          {/* Image with fixed minimum height for visibility */}
          {question.image_url && (
            <div className="min-h-[120px] flex items-center justify-center mb-4">
              <img 
                src={question.image_url} 
                alt="Signalbild" 
                className="w-auto h-auto max-h-[120px] object-contain"
              />
            </div>
          )}
          
          <div className="bg-gray-800 p-5 rounded-xl w-full shadow-sm border border-gray-700 mb-4 overflow-y-auto max-h-[50%]">
            {question.category === "Signale" ? (
              <div className="space-y-2">
                {correctAnswer.split('\n').map((line, i) => (
                  <p key={i} className={`${textSizeClass} font-bold text-blue-300`}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className={`${textSizeClass} font-medium text-blue-300`}>
                {correctAnswer}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Desktop Answer Buttons (only shown on desktop) */}
      {!isMobile && onAnswer && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <FlashcardActionButton
            variant="unknown"
            onClick={() => onAnswer(false)}
            label="Nicht gewusst"
          />
          <FlashcardActionButton
            variant="known"
            onClick={() => onAnswer(true)}
            label="Gewusst"
          />
        </div>
      )}
      
      {/* Mobile Swipe Instructions (only shown on mobile) */}
      {isMobile && (
        <div className="swipe-instructions mt-auto flex flex-row items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <ArrowLeft size={16} className="mr-1 text-red-400" /> 
            <span>Nicht gewusst</span>
          </div>
          
          <div className="flex items-center">
            <span>Gewusst</span>
            <ArrowRight size={16} className="ml-1 text-green-400" />
          </div>
        </div>
      )}
    </div>
  );
}
