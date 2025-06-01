
import React from 'react';
import { Question } from '@/types/questions';
import { Button } from '@/components/ui/button';
import { getTextValue } from '@/types/rich-text';
import { cn } from '@/lib/utils';

interface UnifiedCardBackProps {
  question: Question;
  isAnswered: boolean;
  canAnswer: boolean;
  showButtons: boolean;
  onAnswer: (score: number) => void;
}

export function UnifiedCardBack({ 
  question, 
  isAnswered, 
  canAnswer, 
  showButtons, 
  onAnswer 
}: UnifiedCardBackProps) {
  const renderAnswer = () => {
    if (question.question_type === 'open') {
      return (
        <div className="space-y-3">
          <h3 className="text-title-large font-medium text-gray-900">Antwort:</h3>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-body-large text-gray-800 leading-relaxed">
              {getTextValue(question.answers[0]?.text || '')}
            </p>
          </div>
        </div>
      );
    }

    // Multiple Choice
    return (
      <div className="space-y-3">
        <h3 className="text-title-large font-medium text-gray-900">Antworten:</h3>
        <div className="space-y-2">
          {question.answers.map((answer, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg border",
                answer.isCorrect
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                  answer.isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                <p className="text-body-large">{getTextValue(answer.text)}</p>
                {answer.isCorrect && (
                  <span className="ml-auto text-green-600 text-sm font-medium">
                    ✓ Richtig
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Answer Content */}
      <div className="flex-1">
        {renderAnswer()}
      </div>

      {/* Self-Assessment Buttons */}
      {showButtons && canAnswer && !isAnswered && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Wie sicher warst du bei der Antwort?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnswer(1)}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              😔 Unsicher
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnswer(3)}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              🤔 Ok
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnswer(5)}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              😊 Sicher
            </Button>
          </div>
        </div>
      )}

      {/* Answered State */}
      {isAnswered && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Antwort bewertet!</p>
            <p className="text-xs text-gray-500">
              Diese Karte wird entsprechend deiner Bewertung wiederholt.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
