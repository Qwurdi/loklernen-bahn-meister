
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import { getTextValue } from '@/types/rich-text';
import { cn } from '@/lib/utils';

interface UnifiedCardFrontProps {
  question: Question;
  showHints: boolean;
  regulationPreference: RegulationFilterType;
}

export function UnifiedCardFront({ 
  question, 
  showHints, 
  regulationPreference 
}: UnifiedCardFrontProps) {
  const questionText = getTextValue(question.text);
  
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-ultramarine text-white">
          {question.sub_category}
        </span>
        <span className="text-xs text-gray-500">
          {question.question_type === 'open' ? 'Offene Frage' : 'Multiple Choice'}
        </span>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-headline-medium mb-4 text-gray-900 leading-relaxed">
          {questionText}
        </h2>

        {/* Question Image */}
        {question.image_url && (
          <div className="mb-4">
            <img
              src={question.image_url}
              alt="Fragenbild"
              className="w-full h-48 object-contain rounded-lg bg-gray-100"
              loading="lazy"
            />
          </div>
        )}

        {/* Hint */}
        {showHints && question.hint && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-[#3F00FF]">
            <p className="text-sm text-gray-700">
              💡 <strong>Tipp:</strong> {question.hint}
            </p>
          </div>
        )}
      </div>

      {/* Difficulty Indicator */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < question.difficulty
                  ? "bg-gradient-ultramarine"
                  : "bg-gray-300"
              )}
            />
          ))}
          <span className="ml-2 text-xs text-gray-600">
            Schwierigkeit {question.difficulty}/5
          </span>
        </div>
        
        <span className="text-xs text-gray-500">
          Zum Umdrehen antippen
        </span>
      </div>
    </div>
  );
}
