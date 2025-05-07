
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionCategorySelector } from "@/components/admin/questions/QuestionCategorySelector";
import { QuestionSubCategorySelector } from "@/components/admin/questions/QuestionSubCategorySelector";
import { QuestionTypeSelector } from "@/components/admin/questions/QuestionTypeSelector";
import { RegulationCategorySelector } from "@/components/admin/questions/RegulationCategorySelector";
import { RichTextEditor } from "@/components/ui/rich-text/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUpload } from "@/components/admin/questions/content/ImageUpload";
import { HintField } from "@/components/admin/questions/content/HintField";
import { SignalQuestionAnswer } from "@/components/admin/questions/answers/SignalQuestionAnswer";
import { MultipleChoiceAnswers } from "@/components/admin/questions/answers/MultipleChoiceAnswers";
import { QuestionCategory, RegulationCategory, QuestionType, Answer } from '@/types/questions';
import { useImagePaste } from "@/hooks/questions/useImagePaste";
import { StructuredContent } from "@/types/rich-text";

interface QuestionEditorProps {
  category: QuestionCategory;
  subCategory: string;
  difficulty: number;
  text: string | StructuredContent;
  hint?: string | null;
  isSignalQuestion: boolean;
  regulationCategory?: RegulationCategory;
  imagePreview: string | null;
  answers: Answer[];
  questionType: QuestionType;
  onCategoryChange: (category: QuestionCategory) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onDifficultyChange: (difficulty: number) => void;
  onQuestionTypeChange: (type: QuestionType) => void;
  onRegulationCategoryChange: (regulationCategory: RegulationCategory) => void;
  onTextChange: (value: string | StructuredContent) => void;
  onHintChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePastedImage?: (file: File) => void;
  removeImage: () => void;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  category,
  subCategory,
  difficulty,
  text,
  hint,
  isSignalQuestion,
  regulationCategory = 'both',
  imagePreview,
  answers,
  questionType,
  onCategoryChange,
  onSubCategoryChange,
  onDifficultyChange,
  onQuestionTypeChange,
  onRegulationCategoryChange,
  onTextChange,
  onHintChange,
  onImageChange,
  handlePastedImage,
  removeImage,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  addAnswer
}) => {
  // Use the custom hook for paste functionality
  useImagePaste(handlePastedImage);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
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
                
                {!isSignalQuestion ? (
                  <div className="space-y-4">
                    <Label>Fragetyp</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        type="button"
                        variant={questionType === "MC_single" ? "default" : "outline"}
                        onClick={() => onQuestionTypeChange("MC_single")}
                        className="justify-start h-auto py-3 px-4"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Single-Choice</span>
                          <span className="text-xs text-muted-foreground">Nur eine Antwort ist richtig</span>
                        </div>
                      </Button>
                      
                      <Button
                        type="button"
                        variant={questionType === "MC_multi" ? "default" : "outline"}
                        onClick={() => onQuestionTypeChange("MC_multi")}
                        className="justify-start h-auto py-3 px-4"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Multiple-Choice</span>
                          <span className="text-xs text-muted-foreground">Mehrere Antworten können richtig sein</span>
                        </div>
                      </Button>
                      
                      <Button
                        type="button"
                        variant={questionType === "open" ? "default" : "outline"}
                        onClick={() => onQuestionTypeChange("open")}
                        className="justify-start h-auto py-3 px-4"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Offene Frage</span>
                          <span className="text-xs text-muted-foreground">Freitext-Antwort</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div>
                      <p className="font-medium">Offene Frage</p>
                      <p className="text-sm text-muted-foreground">
                        Signalfragen werden immer als offene Fragen gestellt.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Schwierigkeitsgrad</h3>
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
              </div>
            </CardContent>
          </Card>

          {isSignalQuestion && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Regelwerk</h3>
                  <RegulationCategorySelector 
                    value={regulationCategory}
                    onChange={onRegulationCategoryChange}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Content and Answers */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Fragetext</h3>
                <RichTextEditor
                  value={text}
                  onChange={onTextChange}
                  placeholder="Was ist die Bedeutung dieses Signals?"
                  minHeight="150px"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <HintField hint={hint} onChange={onHintChange} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <ImageUpload 
                imagePreview={imagePreview}
                onImageChange={onImageChange}
                handlePastedImage={handlePastedImage}
                removeImage={removeImage}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Answer Section (Full Width) */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Antwortoptionen</h3>
              {!isSignalQuestion && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAnswer}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  Antwort hinzufügen
                </Button>
              )}
            </div>
            
            {questionType === "open" && isSignalQuestion ? (
              <SignalQuestionAnswer
                answerText={answers?.[0]?.text || ""}
                onAnswerChange={(text) => handleAnswerChange(0, text)}
              />
            ) : (
              <MultipleChoiceAnswers
                answers={answers}
                questionType={questionType}
                handleAnswerChange={handleAnswerChange}
                toggleAnswerCorrectness={toggleAnswerCorrectness}
                removeAnswer={removeAnswer}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
