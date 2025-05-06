
import React from 'react';
import { RichTextEditor } from '@/components/ui/rich-text/RichTextEditor';

interface QuestionTextEditorProps {
  text: string;
  onTextChange: (value: string) => void;
}

export const QuestionTextEditor: React.FC<QuestionTextEditorProps> = ({
  text,
  onTextChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Fragetext</h3>
      </div>
      <RichTextEditor
        value={text}
        onChange={onTextChange}
        placeholder="Was ist die Bedeutung dieses Signals?"
        minHeight="150px"
      />
      <p className="text-sm text-muted-foreground">
        Verwenden Sie die Formatierungsoptionen für eine bessere Lesbarkeit.
      </p>
    </div>
  );
};
