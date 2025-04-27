
import React from "react";
import { Question } from "@/types/questions";
import { QuestionCard } from "./QuestionCard";

interface QuestionCardGridProps {
  questions: Question[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isLoading?: boolean;
}

export const QuestionCardGrid: React.FC<QuestionCardGridProps> = ({
  questions,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading = false
}) => {
  if (questions.length === 0) {
    return (
      <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">Keine Fragen in dieser Kategorie gefunden.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onEdit={() => onEdit(question.id)}
          onDelete={() => onDelete(question.id)}
          onDuplicate={() => onDuplicate(question.id)}
          disabled={isLoading}
        />
      ))}
    </div>
  );
};
