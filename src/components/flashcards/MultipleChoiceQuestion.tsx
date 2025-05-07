
import React, { useState } from "react";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";

interface MultipleChoiceQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isMobile: boolean;
}

export default function MultipleChoiceQuestion({ 
  question, 
  onAnswer,
  isMobile 
}: MultipleChoiceQuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const textSizeClass = useDynamicTextSize(question.text);
  const isSingleChoice = question.question_type === 'MC_single';
  
  // Calculate correct answer indices for validation
  const correctAnswerIndices = question.answers
    .map((answer, index) => answer.isCorrect ? index : -1)
    .filter(index => index !== -1);
  
  const handleSingleChoiceChange = (value: string) => {
    const index = parseInt(value, 10);
    setSelectedAnswers([index]);
  };
  
  const handleMultiChoiceChange = (index: number, checked: boolean) => {
    setSelectedAnswers(prev => 
      checked 
        ? [...prev, index] 
        : prev.filter(i => i !== index)
    );
  };
  
  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return;
    
    // For single choice, check if the selected answer is correct
    if (isSingleChoice) {
      const selectedIsCorrect = question.answers[selectedAnswers[0]]?.isCorrect || false;
      setIsCorrect(selectedIsCorrect);
      setSubmitted(true);
      onAnswer(selectedIsCorrect);
      return;
    }
    
    // For multiple choice, all correct answers must be selected and no incorrect ones
    const allCorrectSelected = correctAnswerIndices.every(index => 
      selectedAnswers.includes(index)
    );
    
    const noIncorrectSelected = selectedAnswers.every(index => 
      question.answers[index]?.isCorrect
    );
    
    const isFullyCorrect = allCorrectSelected && noIncorrectSelected;
    setIsCorrect(isFullyCorrect);
    setSubmitted(true);
    onAnswer(isFullyCorrect);
  };
  
  return (
    <div className="w-full flex flex-col">
      {/* Question text */}
      <div className={`${textSizeClass} mb-4 font-medium`}>
        {question.text}
      </div>
      
      <div className={`space-y-3 mb-6 ${isMobile ? 'pr-1' : ''}`}>
        {/* Single choice radio buttons */}
        {isSingleChoice && (
          <RadioGroup
            value={selectedAnswers[0]?.toString()}
            onValueChange={handleSingleChoiceChange}
            disabled={submitted}
            className="space-y-2"
          >
            {question.answers.map((answer, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-2 p-3 rounded-md border ${
                  submitted && answer.isCorrect
                    ? 'bg-green-50 border-green-200' 
                    : submitted && selectedAnswers.includes(index) && !answer.isCorrect
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-white border-gray-200'
                }`}
              >
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`answer-${index}`} 
                  className="mt-1"
                />
                <label 
                  htmlFor={`answer-${index}`} 
                  className={`flex-1 text-sm ${
                    submitted && answer.isCorrect
                      ? 'font-medium text-green-800' 
                      : submitted && selectedAnswers.includes(index) && !answer.isCorrect
                        ? 'text-red-800'
                        : 'text-gray-700'
                  }`}
                >
                  {answer.text}
                </label>
                {submitted && answer.isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                {submitted && selectedAnswers.includes(index) && !answer.isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </RadioGroup>
        )}
        
        {/* Multiple choice checkboxes */}
        {!isSingleChoice && (
          <div className="space-y-2">
            {question.answers.map((answer, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-2 p-3 rounded-md border ${
                  submitted && answer.isCorrect
                    ? 'bg-green-50 border-green-200' 
                    : submitted && selectedAnswers.includes(index) && !answer.isCorrect
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-white border-gray-200'
                }`}
              >
                <Checkbox 
                  id={`answer-${index}`}
                  checked={selectedAnswers.includes(index)}
                  onCheckedChange={(checked) => 
                    handleMultiChoiceChange(index, checked === true)
                  }
                  disabled={submitted}
                  className="mt-1"
                />
                <label 
                  htmlFor={`answer-${index}`} 
                  className={`flex-1 text-sm ${
                    submitted && answer.isCorrect
                      ? 'font-medium text-green-800' 
                      : submitted && selectedAnswers.includes(index) && !answer.isCorrect
                        ? 'text-red-800'
                        : 'text-gray-700'
                  }`}
                >
                  {answer.text}
                </label>
                {submitted && answer.isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                {submitted && selectedAnswers.includes(index) && !answer.isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Submit or Next button */}
      {!submitted ? (
        <Button 
          onClick={handleSubmit} 
          disabled={selectedAnswers.length === 0}
          className="mt-auto bg-loklernen-ultramarine hover:bg-loklernen-sapphire"
        >
          Antwort prüfen
        </Button>
      ) : (
        <div className="mt-4 flex flex-col">
          <div className={`mb-3 font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect 
              ? "Korrekt! Gut gemacht!" 
              : "Nicht ganz richtig. Die richtige Antwort ist markiert."}
          </div>
          <Button 
            onClick={() => onAnswer(isCorrect)} 
            className="bg-loklernen-ultramarine hover:bg-loklernen-sapphire"
          >
            Weiter zur nächsten Frage
          </Button>
        </div>
      )}
    </div>
  );
}
