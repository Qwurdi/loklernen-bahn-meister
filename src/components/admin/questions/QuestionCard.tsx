import React, { useState } from "react";
import { Question } from "@/types/questions";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const firstAnswer = question.answers.find(a => a.isCorrect)?.text || question.answers[0]?.text || "";

  const getCategoryColor = (category: string) => {
    return category === "Signale" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-green-100 text-green-800 hover:bg-green-200";
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "open": return "Offen";
      case "MC_single": return "Single Choice";
      case "MC_multi": return "Multiple Choice";
      default: return type;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        {question.image_url ? (
          <div className="aspect-video w-full overflow-hidden bg-gray-100">
            <img
              src={question.image_url}
              alt={question.text}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <p className="text-sm text-gray-400">Kein Bild</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge variant="outline" className={getCategoryColor(question.category)}>
            {question.category}
          </Badge>
          <Badge variant="outline">
            {getTypeLabel(question.question_type)}
          </Badge>
          <Badge variant="outline" className="bg-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`inline-block h-1.5 w-1.5 rounded-full mx-0.5 ${
                  i < question.difficulty ? "bg-amber-400" : "bg-gray-300"
                }`}
              />
            ))}
          </Badge>
        </div>
        <h3 className="mb-3 text-lg font-medium line-clamp-2">{question.text}</h3>
        <div className="mb-2 text-sm text-gray-500">{question.sub_category}</div>
        
        <div className="mt-3 rounded-md bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Antwort</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {showAnswer ? (
            <p className="text-sm">{firstAnswer}</p>
          ) : (
            <p className="text-sm text-gray-400">Klicken Sie, um die Antwort anzuzeigen</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50 px-4 py-2">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" />
            Bearbeiten
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDuplicate}
            title="Frage duplizieren"
          >
            <Copy className="mr-1 h-4 w-4" />
            Duplizieren
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-600" 
          onClick={onDelete}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Löschen
        </Button>
      </CardFooter>
    </Card>
  );
};
