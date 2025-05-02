
import React from 'react';
import { Question } from '@/types/questions';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CardBackProps {
  question: Question;
}

export default function CardBack({ question }: CardBackProps) {
  const correctAnswer = question.answers.find(a => a.isCorrect)?.text || '';
  
  return (
    <div className="w-full h-full bg-blue-50 p-6 flex flex-col rounded-2xl">
      <div className="bg-blue-100 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-2">
        Antwort
      </div>
      
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col items-center w-full py-4">
          {question.image_url && (
            <img 
              src={question.image_url} 
              alt="Signalbild" 
              className="max-h-[120px] object-contain mb-4"
            />
          )}
          
          <div className="bg-blue-100 p-5 rounded-xl w-full shadow-sm border border-blue-200 mb-4">
            {question.category === "Signale" ? (
              <div className="space-y-3">
                {correctAnswer.split('\n').map((line, i) => (
                  <p key={i} className="font-bold text-lg text-blue-800">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="font-medium text-lg text-blue-800">
                {correctAnswer}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="swipe-instructions mt-auto flex flex-row items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <ArrowLeft size={16} className="mr-1 text-red-500" /> 
          <span>Nicht gewusst</span>
        </div>
        
        <div className="flex items-center">
          <span>Gewusst</span>
          <ArrowRight size={16} className="ml-1 text-green-500" />
        </div>
      </div>
    </div>
  );
}
