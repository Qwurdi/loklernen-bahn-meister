
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuestionTextProps {
  text: string;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const QuestionText: React.FC<QuestionTextProps> = ({
  text,
  onTextChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="text">Fragetext</Label>
      <Textarea
        id="text"
        name="text"
        placeholder="Was ist die Bedeutung dieses Signals?"
        value={text}
        onChange={onTextChange}
        className="min-h-[100px]"
      />
    </div>
  );
};
