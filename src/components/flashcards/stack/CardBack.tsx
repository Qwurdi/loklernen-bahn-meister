
import { Question } from '@/types/questions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

// Update interface to use generics
interface CardBackProps<T extends Question = Question> {
  question: T;
  onAnswer?: (known: boolean) => void;
}

// Add generic type parameter to the component
export default function CardBack<T extends Question = Question>({ question, onAnswer }: CardBackProps<T>) {
  return (
    <div className="card-face back h-full w-full p-4 flex flex-col bg-gray-50 text-gray-800">
      {/* Card content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Answer heading */}
        <div className="text-sm font-medium uppercase text-gray-500 mb-2">Antwort</div>
        
        {/* Answers */}
        <div className="answers-container flex-1">
          {question.question_type === 'open' ? (
            // For open questions, show all correct answers
            <div className="open-answer mb-4">
              {question.answers
                .filter(ans => ans.isCorrect)
                .map((answer, idx) => (
                  <div 
                    key={idx} 
                    className="bg-green-50 border border-green-200 p-3 rounded-md text-green-800 mb-2 font-medium"
                  >
                    {answer.text}
                  </div>
                ))}
            </div>
          ) : (
            // For multiple choice questions
            <ul className="space-y-2">
              {question.answers.map((answer, idx) => (
                <li 
                  key={idx}
                  className={`p-3 rounded-md ${
                    answer.isCorrect 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-gray-100 border border-gray-200 text-gray-500'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
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
      
      {/* Action buttons (desktop only) */}
      {onAnswer && (
        <div className="flex justify-between mt-4 space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 border-red-300 hover:border-red-500 hover:bg-red-50 group"
            onClick={() => onAnswer(false)}
          >
            <XCircle className="h-4 w-4 mr-2 text-red-500 group-hover:text-red-600" />
            Nicht gewusst
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 border-green-300 hover:border-green-500 hover:bg-green-50 group"
            onClick={() => onAnswer(true)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 group-hover:text-green-600" />
            Gewusst
          </Button>
        </div>
      )}
      
      {/* Mobile instructions */}
      {!onAnswer && (
        <div className="instructions text-sm text-gray-500 mt-4 text-center">
          Wische nach links (nicht gewusst) oder rechts (gewusst)
        </div>
      )}
    </div>
  );
}
