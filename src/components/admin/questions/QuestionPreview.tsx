
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Answer, RegulationCategory } from '@/types/questions';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import { StructuredContent } from '@/types/rich-text';

interface QuestionPreviewProps {
  text: string | StructuredContent;
  imagePreview: string | null;
  answers: Answer[];
  category: string;
  sub_category: string;
  difficulty: number;
  regulation_category?: RegulationCategory;
}

export const QuestionPreview = ({ 
  text, 
  imagePreview, 
  answers, 
  category, 
  sub_category, 
  difficulty,
  regulation_category
}: QuestionPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vorschau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="font-medium">
            {text ? <SafeRichText content={text} /> : "Fragetext erscheint hier"}
          </div>
          
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
                  <div>
                    <SafeRichText content={answer.text || `Antwort ${index + 1}`} />
                  </div>
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
            {regulation_category && category === "Signale" && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-1">
                Regelwerk: {regulation_category}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
