
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface QuestionEditorHeaderProps {
  isEditMode: boolean;
  isLoading: boolean;
  onSave: () => void;
}

export const QuestionEditorHeader = ({ isEditMode, isLoading, onSave }: QuestionEditorHeaderProps) => {
  return (
    <>
      <Breadcrumb>
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
          <Link to="/admin/questions">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{isEditMode ? "Frage bearbeiten" : "Neue Frage erstellen"}</h1>
        </div>
        <Button 
          variant="default" 
          onClick={onSave}
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Speichern..." : "Speichern"}
        </Button>
      </div>
    </>
  );
};
