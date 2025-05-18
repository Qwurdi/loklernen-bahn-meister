
import React from "react";
import { Question } from "@/types/questions";
import { CheckCircle2, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";

interface SingleChoiceOptionsProps {
  question: Question;
  selectedAnswers: number[];
  submitted: boolean;
  onValueChange: (value: string) => void;
}

export default function SingleChoiceOptions({ 
  question, 
  selectedAnswers, 
  submitted,
  onValueChange 
}: SingleChoiceOptionsProps) {
  return (
    <RadioGroup
      value={selectedAnswers[0]?.toString()}
      onValueChange={onValueChange}
      disabled={submitted}
      className="space-y-2"
    >
      {question.answers.map((answer, index) => (
        <div 
          key={index} 
          className={`flex items-start space-x-2 p-3 rounded-md border ${
            submitted && answer.isCorrect
              ? 'mc-option-correct' 
              : submitted && selectedAnswers.includes(index) && !answer.isCorrect
                ? 'mc-option-incorrect' 
                : 'hover:bg-gray-50 border-gray-200'
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
            <SafeRichText content={answer.text} />
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
  );
}
