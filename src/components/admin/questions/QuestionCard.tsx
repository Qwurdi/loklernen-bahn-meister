
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy, AlertCircle } from "lucide-react";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { duplicateQuestion } from "@/api/questions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface QuestionCardProps {
  question: Question;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
  onDuplicate,
  disabled = false
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const textSize = useDynamicTextSize(question.text);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const handleDuplicateClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDuplicating(true);
      const duplicated = await duplicateQuestion(question);
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success("Frage erfolgreich dupliziert!");
      navigate(`/admin/questions/edit/${duplicated.id}`);
    } catch (error) {
      console.error("Error duplicating question:", error);
      toast.error("Fehler beim Duplizieren der Frage.");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    onDelete();
    setIsDeleting(false);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:border-loklernen-ultramarine/30 transition-colors cursor-pointer" onClick={onEdit}>
      <CardHeader className="p-4 bg-gray-50 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">{question.category}</p>
            <h3 className="font-medium text-sm line-clamp-1">{question.sub_category}</h3>
          </div>
          <div className="flex gap-1">
            {question.regulation_category && (
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {question.regulation_category}
              </span>
            )}
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              {question.question_type === "open" ? "Offen" : 
               question.question_type === "MC_single" ? "Single Choice" : "Multiple Choice"}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow overflow-hidden">
        <div className={`${textSize} line-clamp-3 mb-2`} dangerouslySetInnerHTML={{ __html: question.text }} />
        
        {question.image_url && (
          <div className="mt-2 h-24 rounded-md border overflow-hidden bg-gray-50">
            <img 
              src={question.image_url} 
              alt="Question" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t flex justify-between items-center bg-gray-50 flex-shrink-0">
        <div className="flex items-center">
          <div className="flex items-center">
            {Array.from({ length: question.difficulty }).map((_, i) => (
              <span key={i} className="text-amber-400">★</span>
            ))}
            {Array.from({ length: 5 - question.difficulty }).map((_, i) => (
              <span key={i} className="text-gray-300">★</span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            disabled={disabled}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDuplicateClick}
            disabled={disabled || isDuplicating}
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => e.stopPropagation()}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Frage löschen
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Sind Sie sicher, dass Sie diese Frage löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? "Löschen..." : "Löschen"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};
