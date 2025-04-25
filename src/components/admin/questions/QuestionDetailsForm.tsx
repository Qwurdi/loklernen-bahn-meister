
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, Trash2, Plus, X } from "lucide-react";
import { SignalAnswerInput } from "@/components/admin/SignalAnswerInput";
import { Answer, QuestionType } from '@/types/questions';

interface QuestionDetailsFormProps {
  text: string;
  imagePreview: string | null;
  questionType: QuestionType;
  answers: Answer[];
  isSignalQuestion: boolean;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
}

export const QuestionDetailsForm = ({
  text,
  imagePreview,
  questionType,
  answers,
  isSignalQuestion,
  onTextChange,
  onImageChange,
  removeImage,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  addAnswer,
}: QuestionDetailsFormProps) => {
  return (
    <div className="space-y-6">
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
      
      <div className="space-y-2">
        <Label>Bild (optional)</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Image className="mr-2 h-4 w-4" />
              Bild auswählen
            </Button>
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                onClick={removeImage}
                size="icon"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />
          </div>
          
          {imagePreview && (
            <div className="mt-2 overflow-hidden rounded-md border">
              <img 
                src={imagePreview} 
                alt="Vorschau" 
                className="max-h-[200px] w-full object-contain" 
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Antworten</Label>
          {!isSignalQuestion && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAnswer}
            >
              <Plus className="mr-2 h-4 w-4" />
              Antwort hinzufügen
            </Button>
          )}
        </div>
        
        {questionType === "open" && isSignalQuestion ? (
          <SignalAnswerInput
            value={answers?.[0]?.text || ""}
            onChange={(text) => handleAnswerChange(0, text)}
          />
        ) : (
          <div className="space-y-3">
            {answers?.map((answer, index) => (
              <div key={index} className="flex items-start gap-2 rounded-md border border-gray-200 p-2">
                <Button
                  type="button"
                  size="icon"
                  variant={answer.isCorrect ? "default" : "outline"}
                  className="mt-1 h-6 w-6 shrink-0"
                  onClick={() => toggleAnswerCorrectness(index)}
                >
                  {answer.isCorrect && <span>✓</span>}
                </Button>
                <Textarea
                  placeholder={`Antwort ${index + 1}`}
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="flex-1 min-h-[60px]"
                />
                {answers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 h-6 w-6 shrink-0"
                    onClick={() => removeAnswer(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
