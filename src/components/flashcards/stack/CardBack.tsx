
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
    <div className="card-face back h-full w-full p-4 flex flex-col glass-card text-white">
      {/* Card content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Answer heading with new style */}
        <div className="text-sm font-medium uppercase bg-gradient-lavender bg-clip-text text-transparent mb-3">Antwort</div>
        
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
                    className="bg-gradient-to-r from-loklernen-mint/20 to-loklernen-mint/10 backdrop-blur-sm border border-loklernen-mint/30 p-3 rounded-md text-white mb-2 font-medium shadow-sm"
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
                  className={`p-3 rounded-md backdrop-blur-sm shadow-sm ${
                    answer.isCorrect 
                      ? 'bg-gradient-to-r from-loklernen-mint/20 to-loklernen-mint/10 border border-loklernen-mint/30 text-white' 
                      : 'bg-black/20 border border-white/10 text-gray-400'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-loklernen-mint" />
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
            className="flex-1 border-loklernen-coral/50 hover:border-loklernen-coral hover:bg-loklernen-coral/10 group text-white"
            onClick={() => onAnswer(false)}
          >
            <XCircle className="h-4 w-4 mr-2 text-loklernen-coral group-hover:text-loklernen-coral" />
            Nicht gewusst
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 border-loklernen-mint/50 hover:border-loklernen-mint hover:bg-loklernen-mint/10 group text-white"
            onClick={() => onAnswer(true)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2 text-loklernen-mint group-hover:text-loklernen-mint" />
            Gewusst
          </Button>
        </div>
      )}
      
      {/* Mobile instructions with enhanced styling */}
      {!onAnswer && (
        <div className="instructions text-sm text-loklernen-lavender/80 mt-4 text-center backdrop-blur-sm px-2 py-1 rounded-full border border-loklernen-lavender/20">
          Wische nach links (nicht gewusst) oder rechts (gewusst)
        </div>
      )}
    </div>
  );
}
