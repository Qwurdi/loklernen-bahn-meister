
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Answer } from '@/types/questions';

interface QuestionPreviewProps {
  text: string;
  imagePreview: string | null;
  answers: Answer[];
  category: string;
  sub_category: string;
  difficulty: number;
}

export const QuestionPreview = ({ 
  text, 
  imagePreview, 
  answers, 
  category, 
  sub_category, 
  difficulty 
}: QuestionPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vorschau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="font-medium">{text || "Fragetext erscheint hier"}</div>
          
          {imagePreview && (
            <div className="overflow-hidden rounded-md border">
              <img 
                src={imagePreview}
                alt="Vorschau" 
                className="max-h-[150px] w-full object-contain" 
              />
            </div>
          )}
          
          <div>
            <h4 className="mb-2 text-sm font-medium">Antworten:</h4>
            <ul className="space-y-1">
              {answers?.map((answer, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className={`h-3 w-3 shrink-0 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>{answer.text || `Antwort ${index + 1}`}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2 text-xs text-gray-500">
            <span className="rounded-full bg-gray-100 px-2 py-1">
              {category} / {sub_category}
            </span>
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-1">
              Schwierigkeit: {difficulty}/5
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
