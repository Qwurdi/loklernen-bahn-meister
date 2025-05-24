
import React, { useState, useRef } from 'react';
import { Question } from '@/types/questions';
import { useCardSwipe } from './swipe/useCardSwipe';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { getTextValue } from '@/types/rich-text';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface MobileFlashcardProps {
  question: Question;
  onAnswer: (score: number) => void;
  className?: string;
}

export default function MobileFlashcard({ question, onAnswer, className = '' }: MobileFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isMultipleChoice = question.question_type === 'MC_single' || question.question_type === 'MC_multi';
  const questionTextValue = getTextValue(question.text);
  const textSizeClass = useDynamicTextSize(questionTextValue, 'question');
  
  const { handlers } = useCardSwipe({
    onSwipeLeft: () => handleAnswer(2),
    onSwipeRight: () => handleAnswer(5),
    onShowAnswer: () => !isFlipped && setIsFlipped(true),
    isFlipped,
    isAnswered,
    disableSwipe: isAnswered || (isFlipped && isMultipleChoice)
  });

  const handleAnswer = (score: number) => {
    setIsAnswered(true);
    onAnswer(score);
  };

  const handleShowAnswer = () => {
    setIsFlipped(true);
  };

  const getCorrectAnswer = () => {
    if (isMultipleChoice) {
      return question.answers.filter(a => a.isCorrect).map(a => a.text).join(', ');
    }
    return question.answers[0]?.text || '';
  };

  return (
    <div 
      ref={cardRef}
      className={`w-full h-full bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
      {...handlers}
    >
      {!isFlipped ? (
        // Question Side
        <div className="h-full flex flex-col p-6">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {question.category} • {question.sub_category}
            </span>
          </div>
          
          {/* Question Text */}
          <div className={`${textSizeClass} font-medium text-gray-900 mb-6 flex-shrink-0`}>
            <SafeRichText content={question.text} />
          </div>
          
          {/* Image */}
          {question.image_url && (
            <div className="flex-1 flex items-center justify-center mb-6 min-h-0">
              <img
                src={question.image_url}
                alt="Question"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}
          
          {/* Hint */}
          {question.hint && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <SafeRichText content={question.hint} />
                </div>
              </div>
            </div>
          )}
          
          {/* Tap hint */}
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">
              Tippe auf die Karte, um die Antwort zu sehen
            </p>
            <button
              onClick={handleShowAnswer}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium"
            >
              Antwort anzeigen
            </button>
          </div>
        </div>
      ) : (
        // Answer Side
        <div className="h-full flex flex-col p-6">
          {/* Answer Badge */}
          <div className="mb-4">
            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
              Antwort
            </span>
          </div>
          
          {/* Answer Content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
              <div className="text-lg font-semibold text-green-800">
                <SafeRichText content={getCorrectAnswer()} />
              </div>
            </div>
            
            {/* Image (if any) */}
            {question.image_url && (
              <div className="flex justify-center mb-6">
                <img
                  src={question.image_url}
                  alt="Answer"
                  className="max-w-full max-h-32 object-contain rounded-lg"
                />
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {!isAnswered && !isMultipleChoice && (
            <div className="space-y-3">
              <p className="text-center text-gray-600 text-sm mb-4">
                Wische nach links (nicht gewusst) oder rechts (gewusst)
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(2)}
                  className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Nicht gewusst
                </button>
                <button
                  onClick={() => handleAnswer(5)}
                  className="flex-1 py-3 bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Gewusst
                </button>
              </div>
            </div>
          )}
          
          {/* Multiple Choice Options */}
          {!isAnswered && isMultipleChoice && (
            <div className="space-y-2">
              {question.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(answer.isCorrect ? 5 : 2)}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <SafeRichText content={answer.text} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
