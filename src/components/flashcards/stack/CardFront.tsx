
import { Question } from '@/types/questions';
import { Fragment } from 'react';
import ZoomableImage from '@/components/common/ZoomableImage';

// Update interface to use generics
interface CardFrontProps<T extends Question = Question> {
  question: T;
}

// Add generic type parameter to the component
export default function CardFront<T extends Question = Question>({ question }: CardFrontProps<T>) {
  return (
    <div className="card-face front h-full w-full p-6 flex flex-col card-white animate-fade-in-up rounded-xl shadow-md">
      {/* Category badge with updated styling */}
      <div className="category-badge text-xs font-medium px-2.5 py-1.5 rounded-full bg-blue-50 text-blue-600 self-start mb-4">
        {question.sub_category}
      </div>
      
      {/* Question text above the image */}
      <div className="mb-4 text-left">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          {question.text}
        </h3>
      </div>
      
      {/* Card content with enhanced image display */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
        {/* Question image with ZoomableImage */}
        {question.image_url && (
          <ZoomableImage
            src={question.image_url}
            alt="Signalbild"
            containerClassName="w-full max-w-[200px] mx-auto mb-6"
          />
        )}
        
        {/* Instructions with updated styling */}
        <div className="instructions text-sm text-gray-500 mt-auto px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50">
          Tippe zum Umdrehen
        </div>
      </div>
    </div>
  );
}
