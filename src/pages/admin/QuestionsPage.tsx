import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { duplicateQuestion } from "@/api/questions";
import { 
  Plus, 
  Search, 
  Grid3x3,
  Table as TableIcon,
  SlidersHorizontal, 
  Book, 
  FileQuestion 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { QuestionCardGrid } from "@/components/admin/questions/QuestionCardGrid";
import { CategoryOverviewGrid } from "@/components/admin/questions/CategoryOverviewGrid";
import { QuestionTableView } from "@/components/admin/questions/QuestionTableView";
import { QuestionCategory } from "@/types/questions";

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: questions, isLoading, error } = useQuestions();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | QuestionCategory>("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isDuplicating, setIsDuplicating] = useState(false);
  
  const handleDuplicateQuestion = async (questionId: string) => {
    const questionToDuplicate = questions?.find(q => q.id === questionId);
    if (!questionToDuplicate) return;

    try {
      setIsDuplicating(true);
      const duplicatedQuestion = await duplicateQuestion(questionToDuplicate);
      toast.success("Frage wurde dupliziert");
      navigate(`/admin/questions/edit/${duplicatedQuestion.id}`);
    } catch (error) {
      console.error("Error duplicating question:", error);
      const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
      toast.error(`Fehler beim Duplizieren der Frage: ${errorMessage}. Bitte stellen Sie sicher, dass Sie angemeldet sind.`);
    } finally {
      setIsDuplicating(false);
    }
  };

  const filteredQuestions = questions?.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        question.sub_category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;
    const matchesSubCategory = !subCategoryFilter || question.sub_category === subCategoryFilter;
    
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const handleNewSignalQuestion = () => {
    navigate("/admin/questions/create", {
      state: {
        presetCategory: "Signale",
        presetText: "Nenne Begriff und Bedeutung",
        presetType: "open"
      }
    });
  };

  const handleEditQuestion = (id: string) => {
    navigate(`/admin/questions/edit/${id}`);
  };

  const handleDeleteQuestion = (id: string) => {
    navigate(`/admin/questions/delete/${id}`);
  };
  
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
            <BreadcrumbPage>Fragen</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fragenverwaltung</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewSignalQuestion}>
            <Book className="mr-2 h-4 w-4" />
            Neue Signalfrage
          </Button>
          <Link to="/admin/questions/create">
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Neue Frage
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Suche nach Fragen, Kategorien..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            title="Grid-Ansicht"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
            title="Tabellen-Ansicht"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="my-8 text-center">
          <p className="text-gray-500">Lade Fragen...</p>
        </div>
      ) : error ? (
        <div className="my-8 rounded-md bg-red-50 p-4 text-center">
          <p className="text-red-600">Fehler beim Laden der Fragen. Bitte versuchen Sie es später noch einmal.</p>
        </div>
      ) : (
        <>
          <CategoryOverviewGrid 
            questions={questions || []}
            activeCategory={categoryFilter}
            activeSubCategory={subCategoryFilter}
            onCategorySelect={(category) => setCategoryFilter(category)}
            onSubCategorySelect={(subCategory) => setSubCategoryFilter(subCategory)}
          />
          
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {subCategoryFilter || (categoryFilter !== "all" ? categoryFilter : "Alle Fragen")}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredQuestions?.length || 0} {filteredQuestions?.length === 1 ? "Frage" : "Fragen"})
                </span>
              </h2>
              {subCategoryFilter && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSubCategoryFilter(null)}
                >
                  Zurück zu allen {categoryFilter} Fragen
                </Button>
              )}
            </div>
            
            {viewMode === "grid" ? (
              <QuestionCardGrid 
                questions={filteredQuestions || []}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                onDuplicate={(id) => handleDuplicateQuestion(id)}
                isLoading={isDuplicating}
              />
            ) : (
              <QuestionTableView 
                questions={filteredQuestions || []}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                onDuplicate={(id) => handleDuplicateQuestion(id)}
                isLoading={isDuplicating}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionsPage;
