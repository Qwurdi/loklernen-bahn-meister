
import { Question } from '@/types/questions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import ZoomableImage from '@/components/common/ZoomableImage';
import { useIsMobile } from '@/hooks/use-mobile';
import MultipleChoiceQuestion from '../MultipleChoiceQuestion';
import { useState } from 'react';

// Update interface to use generics
interface CardBackProps<T extends Question = Question> {
  question: T;
  onAnswer?: (known: boolean) => void;
}

// Add generic type parameter to the component
export default function CardBack<T extends Question = Question>({ question, onAnswer }: CardBackProps<T>) {
  const isMobile = useIsMobile();
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // For MC questions, use our new component
  if (isMultipleChoice && onAnswer) {
    return (
      <div className="card-face back h-full w-full p-6 flex flex-col card-white rounded-xl shadow-md">
        <div className="text-sm font-medium uppercase text-blue-600 mb-3">Wähle die richtige Antwort</div>
        <div className="flex-1 overflow-y-auto">
          <MultipleChoiceQuestion 
            question={question} 
            onAnswer={onAnswer} 
            isMobile={isMobile}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="card-face back h-full w-full p-6 flex flex-col card-white rounded-xl shadow-md">
      {/* Answer heading with new style */}
      <div className="text-sm font-medium uppercase text-blue-600 mb-3">Antwort</div>
      
      {/* Scrollable container for long content */}
      <div className="flex-1 overflow-y-auto pb-16">
        {/* Answers with enhanced styling */}
        <div className="answers-container">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
            {question.question_type === 'open' ? (
              // For open questions, show all correct answers
              <div className="open-answer">
                {question.answers
                  .filter(ans => ans.isCorrect)
                  .map((answer, idx) => (
                    <div 
                      key={idx} 
                      className="text-blue-800 font-medium"
                    >
                      {answer.text}
                    </div>
                  ))}
              </div>
            ) : (
              // For multiple choice questions
              <ul className="space-y-3">
                {question.answers.map((answer, idx) => (
                  <li 
                    key={idx}
                    className={`p-3 rounded-md ${
                      answer.isCorrect 
                        ? 'bg-green-50 border border-green-100 text-green-800' 
                        : 'bg-gray-50 border border-gray-100 text-gray-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        {answer.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div>{answer.text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Image with ZoomableImage */}
        {question.image_url && (
          <ZoomableImage
            src={question.image_url}
            alt="Signalbild"
            containerClassName="w-full max-w-[200px] mx-auto mb-6"
          />
        )}
      </div>
      
      {/* Action buttons with enhanced styling */}
      {onAnswer && !isMultipleChoice && (
        <div className="sticky bottom-4 mt-auto">
          <div className="flex justify-between space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 border-red-200 hover:border-red-300 hover:bg-red-50 text-gray-800"
              onClick={() => onAnswer(false)}
            >
              <XCircle className="h-4 w-4 mr-2 text-red-500" />
              Nicht gewusst
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 border-green-200 hover:border-green-300 hover:bg-green-50 text-gray-800"
              onClick={() => onAnswer(true)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Gewusst
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
