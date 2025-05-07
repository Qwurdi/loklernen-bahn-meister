
import React from 'react';
import { QuestionCategorySelector } from './QuestionCategorySelector';
import { QuestionSubCategorySelector } from './QuestionSubCategorySelector';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import { QuestionCategory, RegulationCategory, QuestionType } from '@/types/questions';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";
import { RegulationCategorySelector } from './RegulationCategorySelector';

interface BasicInfoTabProps {
  category: QuestionCategory;
  subCategory: string;
  difficulty: number;
  questionType: QuestionType;
  isSignalQuestion: boolean;
  regulationCategory?: RegulationCategory;
  onCategoryChange: (category: QuestionCategory) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onDifficultyChange: (difficulty: number) => void;
  onQuestionTypeChange: (type: QuestionType) => void;
  onRegulationCategoryChange?: (regulationCategory: RegulationCategory) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  category,
  subCategory,
  difficulty,
  questionType,
  isSignalQuestion,
  regulationCategory = "both",
  onCategoryChange,
  onSubCategoryChange,
  onDifficultyChange,
  onQuestionTypeChange,
  onRegulationCategoryChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <QuestionCategorySelector
              category={category}
              onCategoryChange={onCategoryChange}
            />

            <QuestionSubCategorySelector
              category={category}
              subCategory={subCategory}
              onSubCategoryChange={onSubCategoryChange}
            />
          </div>
        </CardContent>
      </Card>

      <QuestionTypeSelector
        questionType={questionType}
        onChange={onQuestionTypeChange}
        isSignalQuestion={isSignalQuestion}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Schwierigkeitsgrad</h3>
            <RadioGroup
              value={difficulty.toString()}
              onValueChange={(value) => onDifficultyChange(parseInt(value))}
              className="flex flex-wrap gap-4"
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
            
            <p className="text-sm text-muted-foreground mt-2">
              Die Schwierigkeit bestimmt, wie oft diese Frage wiederholt werden muss.
            </p>
          </div>
        </CardContent>
      </Card>

      {isSignalQuestion && onRegulationCategoryChange && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Regelwerk</h3>
              <RegulationCategorySelector 
                value={regulationCategory}
                onChange={onRegulationCategoryChange}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
