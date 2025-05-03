
import { Question } from '@/types/questions';
import { Fragment } from 'react';

// Update interface to use generics
interface CardFrontProps<T extends Question = Question> {
  question: T;
}

// Add generic type parameter to the component
export default function CardFront<T extends Question = Question>({ question }: CardFrontProps<T>) {
  return (
    <div className="card-face front h-full w-full p-4 flex flex-col">
      {/* Category badge */}
      <div className="category-badge text-xs font-medium px-2 py-1 rounded-full bg-loklernen-ultramarine/10 text-loklernen-ultramarine self-start mb-4">
        {question.sub_category}
      </div>
      
      {/* Card content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center overflow-auto p-2">
        {/* Question image if available */}
        {question.image_url && (
          <div className="question-image mb-4 max-h-[40%] flex items-center justify-center">
            <img 
              src={question.image_url} 
              alt="Signalbild" 
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        )}
        
        {/* Question text */}
        <div 
          className={`question-text text-lg sm:text-xl font-medium text-gray-800 mb-4 ${
            !question.image_url ? 'flex-1 flex items-center justify-center' : ''
          }`}
        >
          {question.text}
        </div>
        
        {/* Instructions */}
        <div className="instructions text-sm text-gray-500 mt-auto">
          Tippe zum Umdrehen
        </div>
      </div>
    </div>
  );
}
