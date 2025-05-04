
import { Question } from '@/types/questions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Update interface to use generics
interface CardBackProps<T extends Question = Question> {
  question: T;
  onAnswer?: (known: boolean) => void;
}

// Add generic type parameter to the component
export default function CardBack<T extends Question = Question>({ question, onAnswer }: CardBackProps<T>) {
  return (
    <div className="card-face back h-full w-full p-4 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 text-gray-800">
      {/* Card content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Answer heading with new style */}
        <div className="text-sm font-medium uppercase text-loklernen-ultramarine mb-3">Antwort</div>
        
        {/* Image if available - properly contained */}
        {question.image_url && (
          <div className="mb-4 flex items-center justify-center">
            <AspectRatio ratio={4/3} className="w-full max-h-[180px] bg-gray-50 rounded-md">
              <img 
                src={question.image_url} 
                alt="Signal" 
                className="w-full h-full object-contain p-2"
              />
            </AspectRatio>
          </div>
        )}
        
        {/* Answers with enhanced styling */}
        <div className="answers-container flex-1">
          {question.question_type === 'open' ? (
            // For open questions, show all correct answers
            <div className="open-answer mb-4">
              {question.answers
                .filter(ans => ans.isCorrect)
                .map((answer, idx) => (
                  <div 
                    key={idx} 
                    className="bg-blue-50 p-3 rounded-md text-blue-800 mb-2 font-medium border border-blue-100"
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
                  className={`p-3 rounded-md shadow-sm ${
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
      
      {/* Action buttons with enhanced styling */}
      {onAnswer && (
        <div className="flex justify-between mt-4 space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 border-red-200 hover:border-red-300 hover:bg-red-50 group text-gray-700"
            onClick={() => onAnswer(false)}
          >
            <XCircle className="h-4 w-4 mr-2 text-red-500" />
            Nicht gewusst
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 border-green-200 hover:border-green-300 hover:bg-green-50 group text-gray-700"
            onClick={() => onAnswer(true)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            Gewusst
          </Button>
        </div>
      )}
      
      {/* Mobile instructions with enhanced styling */}
      {!onAnswer && (
        <div className="instructions text-sm text-gray-500 mt-4 text-center bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
          Wische nach links (nicht gewusst) oder rechts (gewusst)
        </div>
      )}
    </div>
  );
}
