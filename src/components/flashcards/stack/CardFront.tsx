
import { Question } from '@/types/questions';
import { Fragment } from 'react';

// Update interface to use generics
interface CardFrontProps<T extends Question = Question> {
  question: T;
}

// Add generic type parameter to the component
export default function CardFront<T extends Question = Question>({ question }: CardFrontProps<T>) {
  return (
    <div className="card-face front h-full w-full p-4 flex flex-col glass-card animate-fade-in-up">
      {/* Category badge with gradient */}
      <div className="category-badge text-xs font-medium px-2.5 py-1.5 rounded-full bg-gradient-ultramarine text-white self-start mb-4 shadow-sm">
        {question.sub_category}
      </div>
      
      {/* Card content with enhanced styling */}
      <div className="flex-1 flex flex-col items-center justify-center text-center overflow-auto p-3">
        {/* Question image if available - with enhanced presentation */}
        {question.image_url && (
          <div className="question-image mb-6 max-h-[40%] w-full flex items-center justify-center">
            <div className="relative p-2 bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden animate-float">
              <img 
                src={question.image_url} 
                alt="Signalbild" 
                className="max-h-full max-w-full object-contain rounded-md shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-loklernen-ultramarine/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        )}
        
        {/* Question text with enhanced presentation */}
        <div 
          className={`question-text text-lg sm:text-xl font-medium text-white mb-4 ${
            !question.image_url ? 'flex-1 flex items-center justify-center' : ''
          }`}
        >
          {question.text}
        </div>
        
        {/* Instructions */}
        <div className="instructions text-sm text-loklernen-lavender/80 mt-auto backdrop-blur-sm px-2 py-1 rounded-full border border-loklernen-lavender/20">
          Tippe zum Umdrehen
        </div>
      </div>
    </div>
  );
}
