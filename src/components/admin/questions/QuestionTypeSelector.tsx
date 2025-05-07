
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ListOrdered, Check, Square } from "lucide-react";
import { QuestionType } from '@/types/questions';

interface QuestionTypeSelectorProps {
  questionType: QuestionType;
  onChange: (type: QuestionType) => void;
  isSignalQuestion: boolean;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  questionType,
  onChange,
  isSignalQuestion
}) => {
  if (isSignalQuestion) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>Fragetyp</Label>
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Offene Frage</p>
                  <p className="text-sm text-muted-foreground">
                    Signalfragen werden immer als offene Fragen gestellt, um echte Signalkenntnis abzufragen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label>Fragetyp auswählen</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Wählen Sie aus, ob eine oder mehrere Antworten richtig sein können.
            </p>
          </div>
          
          <ToggleGroup 
            type="single" 
            value={questionType} 
            onValueChange={(value) => {
              if (value) onChange(value as QuestionType);
            }}
            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2"
          >
            <ToggleGroupItem 
              value="MC_single" 
              className="w-full justify-start data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 data-[state=on]:border-blue-200 px-3 py-2 h-auto"
              aria-label="Single-Choice"
            >
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Single-Choice</p>
                  <p className="text-xs text-muted-foreground">Nur eine Antwort ist richtig</p>
                </div>
              </div>
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="MC_multi" 
              className="w-full justify-start data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 data-[state=on]:border-blue-200 px-3 py-2 h-auto"
              aria-label="Multiple-Choice"
            >
              <div className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Multiple-Choice</p>
                  <p className="text-xs text-muted-foreground">Mehrere Antworten können richtig sein</p>
                </div>
              </div>
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="open" 
              className="w-full justify-start data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 data-[state=on]:border-blue-200 px-3 py-2 h-auto"
              aria-label="Offene Frage"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Offene Frage</p>
                  <p className="text-xs text-muted-foreground">Freitext-Antwort</p>
                </div>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
};
