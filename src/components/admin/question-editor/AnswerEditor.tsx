
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Answer, QuestionType } from "@/types/questions";

interface AnswerEditorProps {
  answers: Answer[];
  questionType: QuestionType;
  onAnswerChange: (index: number, value: string) => void;
  onToggleCorrectness: (index: number) => void;
  onRemoveAnswer: (index: number) => void;
  onAddAnswer: () => void;
}

export const AnswerEditor: React.FC<AnswerEditorProps> = ({
  answers,
  questionType,
  onAnswerChange,
  onToggleCorrectness,
  onRemoveAnswer,
  onAddAnswer,
}) => {
  if (questionType === "open") {
    return (
      <div className="rounded-md border border-gray-200 p-4">
        <p className="mb-2 text-sm text-gray-500">Bei offenen Fragen ist nur eine Antwort möglich:</p>
        <div className="flex items-start gap-2">
          <div className="mt-2 flex h-5 items-center">
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </div>
          <Textarea
            placeholder="Korrekte Antwort eingeben"
            value={answers[0]?.text || ""}
            onChange={(e) => onAnswerChange(0, e.target.value)}
            className="flex-1 min-h-[80px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {answers.map((answer, index) => (
        <div key={index} className="flex items-start gap-2 rounded-md border border-gray-200 p-2">
          <Button
            type="button"
            size="icon"
            variant={answer.isCorrect ? "default" : "outline"}
            className="mt-1 h-6 w-6 shrink-0"
            onClick={() => onToggleCorrectness(index)}
          >
            {answer.isCorrect && <span>✓</span>}
          </Button>
          <Textarea
            placeholder={`Antwort ${index + 1}`}
            value={answer.text}
            onChange={(e) => onAnswerChange(index, e.target.value)}
            className="flex-1 min-h-[60px]"
          />
          {answers.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-1 h-6 w-6 shrink-0"
              onClick={() => onRemoveAnswer(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
