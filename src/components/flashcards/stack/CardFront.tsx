
import React from 'react';
import { Question } from '@/types/questions';
import { ArrowDown } from 'lucide-react';

interface CardFrontProps {
  question: Question;
}

export default function CardFront({ question }: CardFrontProps) {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col rounded-2xl">
      <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-500 self-start mb-2">
        {question.category}
      </div>
      
      <h2 className="text-xl font-medium mb-4">
        {question.text}
      </h2>
      
      <div className="flex-1 flex flex-col items-center justify-center py-4 overflow-hidden">
        {question.image_url ? (
          <img 
            src={question.image_url} 
            alt="Signalbild" 
            className="max-h-[220px] max-w-full object-contain"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Kein Bild vorhanden</span>
          </div>
        )}
      </div>
      
      <div className="tap-hint mt-auto flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 mb-1">Tippen, um Antwort anzuzeigen</p>
        <ArrowDown size={20} className="text-gray-400 animate-bounce" />
      </div>
    </div>
  );
}
