
import React from 'react';
import { Question } from '@/types/questions';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';

// Update interface to use generics
interface CardFrontProps<T extends Question = Question> {
  question: T;
}

// Add the generic type parameter to the component
export default function CardFront<T extends Question = Question>({ question }: CardFrontProps<T>) {
  // Use dynamic text sizing based on question length
  const textSizeClass = useDynamicTextSize(question?.text || '', 'question');
  
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white p-6 flex flex-col">
      <div className="text-xs uppercase tracking-wider text-blue-600 font-medium mb-2 bg-blue-50 self-start px-2 py-1 rounded-full">
        {question.sub_category}
      </div>
      
      <h2 className={`${textSizeClass} text-gray-800 font-medium mb-4`}>
        {question.text}
      </h2>
      
      {/* Optimized image loading with loading="eager" for current card */}
      {question.image_url && (
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={question.image_url}
            alt={`Signal: ${question.text}`}
            className="max-h-[200px] object-contain rounded-lg"
            loading="eager" // Force eager loading for current card
          />
        </div>
      )}
      
      <div className="mt-auto text-sm text-gray-500 text-center">
        Tippe, um die Antwort zu sehen
      </div>
    </div>
  );
}
