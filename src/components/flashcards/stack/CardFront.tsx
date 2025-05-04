
import { Question } from '@/types/questions';
import { Fragment } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Update interface to use generics
interface CardFrontProps<T extends Question = Question> {
  question: T;
}

// Add generic type parameter to the component
export default function CardFront<T extends Question = Question>({ question }: CardFrontProps<T>) {
  return (
    <div className="card-face front h-full w-full p-4 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Category badge with ultramarine gradient */}
      <div className="category-badge text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-ultramarine text-white self-start mb-4 shadow-sm">
        {question.sub_category}
      </div>
      
      {/* Card content with enhanced styling */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-3 overflow-auto">
        {/* Question text with enhanced presentation - above the image */}
        <div className="question-text text-lg sm:text-xl font-medium text-gray-800 mb-4 w-full">
          {question.text}
        </div>
        
        {/* Question image if available - with proper containment */}
        {question.image_url && (
          <div className="question-image flex-1 w-full flex items-center justify-center max-h-[60%] overflow-hidden">
            <div className="w-full h-full max-h-[240px] relative">
              <AspectRatio ratio={4/3} className="bg-gray-50 rounded-md">
                <img 
                  src={question.image_url} 
                  alt="Signalbild" 
                  className="w-full h-full object-contain rounded-md p-2"
                />
              </AspectRatio>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="instructions text-sm text-gray-500 mt-auto py-1 px-3 rounded-full bg-gray-50 border border-gray-100">
          Tippe zum Umdrehen
        </div>
      </div>
    </div>
  );
}
