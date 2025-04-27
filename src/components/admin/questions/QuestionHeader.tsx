
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuestionHeaderProps {
  title: string;
  questionCount: number;
  subCategoryFilter: string | null;
  onClearSubCategory: () => void;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  title,
  questionCount,
  subCategoryFilter,
  onClearSubCategory
}) => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-xl font-semibold">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({questionCount} {questionCount === 1 ? "Frage" : "Fragen"})
        </span>
      </h2>
      {subCategoryFilter && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearSubCategory}
        >
          Zurück zu allen Fragen
        </Button>
      )}
    </div>
  );
};
