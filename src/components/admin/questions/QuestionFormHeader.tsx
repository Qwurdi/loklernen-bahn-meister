
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Copy, X } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface QuestionFormHeaderProps {
  isEditMode: boolean;
  isLoading: boolean;
  onSave: (e: React.FormEvent) => void;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onCancel?: () => void;
  showDuplicateButton?: boolean;
}

export const QuestionFormHeader = ({ 
  isEditMode, 
  isLoading, 
  onSave,
  onPreview,
  onDuplicate,
  onCancel,
  showDuplicateButton = false
}: QuestionFormHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4 mb-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/questions">Fragen</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{isEditMode ? "Frage bearbeiten" : "Neue Frage"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onCancel} type="button">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{isEditMode ? "Frage bearbeiten" : "Neue Frage erstellen"}</h1>
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              type="button"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
          )}
        
          {onPreview && (
            <Button 
              variant="outline" 
              onClick={onPreview}
              type="button"
            >
              <Eye className="mr-2 h-4 w-4" />
              Vorschau
            </Button>
          )}
          
          {showDuplicateButton && onDuplicate && (
            <Button 
              variant="outline" 
              onClick={onDuplicate}
              type="button"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplizieren
            </Button>
          )}
          
          <Button 
            variant="default" 
            onClick={(e) => onSave(e)}
            disabled={isLoading}
            type="button"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </div>
    </div>
  );
};
