
import React from 'react';
import { SignalAnswerInput } from "@/components/admin/SignalAnswerInput";

interface SignalQuestionAnswerProps {
  answerText: string;
  onAnswerChange: (text: string) => void;
}

export const SignalQuestionAnswer: React.FC<SignalQuestionAnswerProps> = ({
  answerText,
  onAnswerChange
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Für Signalfragen ist nur eine korrekte Antwort möglich.
      </p>
      <SignalAnswerInput
        value={answerText || ""}
        onChange={(text) => onAnswerChange(text)}
      />
    </div>
  );
};
