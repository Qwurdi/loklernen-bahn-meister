
import React from "react";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";
import SingleChoiceOptions from "./SingleChoiceOptions";
import MultiChoiceOptions from "./MultiChoiceOptions";
import FeedbackSection from "./FeedbackSection";
import QuestionHeader from "./QuestionHeader";
import { useMultipleChoice } from "./useMultipleChoice";

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
  const {
    selectedAnswers,
    submitted,
    isCorrect,
    handleSingleChoiceChange,
    handleMultiChoiceChange,
    handleSubmit,
  } = useMultipleChoice(question);

  const isSingleChoice = question.question_type === 'MC_single';
  
  return (
    <div className="w-full flex flex-col">
      {/* Question header with text and hint button */}
      <QuestionHeader 
        question={question} 
        submitted={submitted}
        isMobile={isMobile}
      />
      
      <div className={`space-y-3 mb-6 ${isMobile ? 'pr-1' : ''}`}>
        {/* Single choice radio buttons */}
        {isSingleChoice ? (
          <SingleChoiceOptions 
            question={question}
            selectedAnswers={selectedAnswers}
            submitted={submitted}
            onValueChange={handleSingleChoiceChange}
          />
        ) : (
          <MultiChoiceOptions 
            question={question}
            selectedAnswers={selectedAnswers}
            submitted={submitted}
            onCheckedChange={handleMultiChoiceChange}
          />
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
        <FeedbackSection 
          isCorrect={isCorrect} 
          onNext={() => onAnswer(isCorrect)} 
        />
      )}
    </div>
  );
}
