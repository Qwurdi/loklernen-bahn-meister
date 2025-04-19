
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const DeleteQuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: questions } = useQuestions();
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (id && questions) {
      const questionToDelete = questions.find(q => q.id === id);
      if (questionToDelete) {
        setQuestion(questionToDelete);
      } else {
        toast.error("Frage nicht gefunden.");
        navigate("/admin/questions");
      }
    }
  }, [id, questions, navigate]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Frage erfolgreich gelöscht!");
      navigate("/admin/questions");
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Fehler beim Löschen der Frage. Bitte versuchen Sie es später noch einmal.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!question) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Lade...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
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
            <BreadcrumbPage>Frage löschen</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center gap-2">
        <Link to="/admin/questions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Frage löschen</h1>
      </div>
      
      <div className="rounded-lg border bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-red-100 p-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-medium text-red-700">Sind Sie sicher, dass Sie diese Frage löschen möchten?</h2>
            <p className="text-gray-600">
              Diese Aktion kann nicht rückgängig gemacht werden. Die Frage wird dauerhaft aus dem System gelöscht.
            </p>
            
            <div className="mt-4 rounded-md border bg-white p-4">
              <h3 className="font-medium">Frage:</h3>
              <p className="mt-1">{question.text}</p>
              
              {question.image_url && (
                <div className="mt-2 max-w-[300px] overflow-hidden rounded-md border">
                  <img 
                    src={question.image_url} 
                    alt="Frage Bild" 
                    className="w-full object-contain" 
                  />
                </div>
              )}
              
              <div className="mt-3">
                <span className="mr-2 rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {question.category} / {question.sub_category}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  Schwierigkeit: {question.difficulty}/5
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-3">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isLoading ? "Löschen..." : "Ja, löschen"}
              </Button>
              <Link to="/admin/questions">
                <Button variant="outline">
                  Abbrechen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuestionPage;
