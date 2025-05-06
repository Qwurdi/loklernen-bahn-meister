
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";

interface DifficultySelectorProps {
  difficulty: number;
  onDifficultyChange: (value: number) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Schwierigkeitsgrad</Label>
      <RadioGroup
        value={difficulty.toString()}
        onValueChange={(value) => onDifficultyChange(parseInt(value))}
        className="flex space-x-4"
      >
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="flex items-center space-x-2">
            <RadioGroupItem value={level.toString()} id={`difficulty-${level}`} />
            <Label htmlFor={`difficulty-${level}`} className="flex items-center space-x-1">
              {Array.from({ length: level }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
