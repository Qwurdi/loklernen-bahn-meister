
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface SignalAnswerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SignalAnswerInput = ({ value, onChange }: SignalAnswerInputProps) => {
  const formatAnswer = (text: string) => {
    const lines = text.split('\n');
    if (lines.length === 1) {
      // Auto-format single line into two lines if it contains a dash
      const parts = text.split('-');
      if (parts.length === 2) {
        return `${parts[0].trim()} - ${parts[1].trim()}\n`;
      }
    }
    return text;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="signalAnswer">Signalantwort</Label>
        <Textarea
          id="signalAnswer"
          placeholder={`Hp 0 - Haltesignal\nHalt! (Regelstellung)`}
          value={value}
          onChange={(e) => onChange(formatAnswer(e.target.value))}
          className="font-medium min-h-[120px]"
        />
      </div>
      
      <Card className="p-4 bg-blue-50">
        <div className="space-y-1">
          <p className="text-sm text-blue-600">Format der Antwort:</p>
          <p className="text-xs text-blue-500">Erste Zeile: Kurzbezeichnung - Langbezeichnung</p>
          <p className="text-xs text-blue-500">Zweite Zeile: Signalbedeutung</p>
        </div>
      </Card>
      
      {value && (
        <Card className="p-4">
          <p className="font-bold mb-2">Vorschau:</p>
          <div className="font-medium">
            {value.split('\n').map((line, i) => (
              <p key={i} className="font-bold">{line}</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
