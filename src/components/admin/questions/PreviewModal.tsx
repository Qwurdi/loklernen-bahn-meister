
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Question } from '@/types/questions';
import { QuestionPreview } from './QuestionPreview';

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Partial<Question>;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ 
  open, 
  onOpenChange, 
  question 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fragevorschau</DialogTitle>
          <DialogDescription>
            So wird die Frage für Lernende angezeigt.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <QuestionPreview
            text={question.text || ""}
            imagePreview={question.image_url || null}
            answers={question.answers || []}
            category={question.category || ""}
            sub_category={question.sub_category || ""}
            difficulty={question.difficulty || 1}
            regulation_category={question.regulation_category}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
