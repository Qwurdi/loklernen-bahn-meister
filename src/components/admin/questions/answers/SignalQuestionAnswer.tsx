
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { RichTextEditor } from '@/components/ui/rich-text/RichTextEditor';
import { getTextValue, StructuredContent } from '@/types/rich-text';

interface SignalQuestionAnswerProps {
  answerText: string | StructuredContent;
  onAnswerChange: (value: string | StructuredContent) => void;
}

export const SignalQuestionAnswer: React.FC<SignalQuestionAnswerProps> = ({
  answerText,
  onAnswerChange
}) => {
  return (
    <div className="space-y-4">
      <RichTextEditor
        value={answerText}
        onChange={onAnswerChange}
        placeholder="Geben Sie die korrekte Antwort ein"
        minHeight="100px"
      />
      
      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm">
          Signalfragen werden immer als offene Fragen mit einer korrekten Antwort konfiguriert.
        </AlertDescription>
      </Alert>
    </div>
  );
};
