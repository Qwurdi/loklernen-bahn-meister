
import React from 'react';
import { Question } from '@/types/questions';
import { ArrowDown } from 'lucide-react';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';

interface CardFrontProps {
  question: Question;
}

export default function CardFront({ question }: CardFrontProps) {
  // Dynamic text size class based on question text length
  const textSizeClass = useDynamicTextSize(question.text, 'question');
  
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col rounded-2xl">
      <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-500 self-start mb-2">
        {question.category}
      </div>
      
      {/* Dynamic text size for the question */}
      <h2 className={`${textSizeClass} font-medium mb-4 overflow-y-auto max-h-[25%] text-gray-800`}>
        {question.text}
      </h2>
      
      {/* Fixed space for the image with minimum height to ensure visibility */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 min-h-[220px]">
        {question.image_url ? (
          <img 
            src={question.image_url} 
            alt="Signalbild" 
            className="w-auto h-auto max-h-[220px] max-w-full object-contain"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Kein Bild vorhanden</span>
          </div>
        )}
      </div>
      
      <div className="tap-hint mt-auto flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 mb-1">Tippen, um Antwort anzuzeigen</p>
        <ArrowDown size={20} className="text-gray-400 animate-bounce" />
      </div>
    </div>
  );
}
