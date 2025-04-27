import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuestionFilters } from "@/hooks/useQuestionFilters";
import { toast } from "sonner";
import { duplicateQuestion } from "@/api/questions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { QuestionCardGrid } from "@/components/admin/questions/QuestionCardGrid";
import { CategoryOverviewGrid } from "@/components/admin/questions/CategoryOverviewGrid";
import { QuestionTableView } from "@/components/admin/questions/QuestionTableView";
import { QuestionActions } from "@/components/admin/questions/QuestionActions";
import { QuestionSearchBar } from "@/components/admin/questions/QuestionSearchBar";
import { QuestionHeader } from "@/components/admin/questions/QuestionHeader";
import { QuestionCategory } from "@/types/questions";

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: questions, isLoading, error } = useQuestions();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isDuplicating, setIsDuplicating] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    filteredQuestions
  } = useQuestionFilters({ questions });

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
      toast.error(`Fehler beim Duplizieren der Frage: ${errorMessage}`);
    } finally {
      setIsDuplicating(false);
    }
  };

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

  const getHeaderTitle = () => {
    if (subCategoryFilter) return subCategoryFilter;
    if (categoryFilter !== "all") return categoryFilter;
    return "Alle Fragen";
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
        <QuestionActions onNewSignalQuestion={handleNewSignalQuestion} />
      </div>
      
      <QuestionSearchBar
        searchQuery={searchQuery}
        viewMode={viewMode}
        onSearchChange={setSearchQuery}
        onViewModeChange={setViewMode}
      />
      
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
            <QuestionHeader
              title={getHeaderTitle()}
              questionCount={filteredQuestions.length}
              subCategoryFilter={subCategoryFilter}
              onClearSubCategory={() => setSubCategoryFilter(null)}
            />
            
            {viewMode === "grid" ? (
              <QuestionCardGrid 
                questions={filteredQuestions}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                onDuplicate={handleDuplicateQuestion}
                isLoading={isDuplicating}
              />
            ) : (
              <QuestionTableView 
                questions={filteredQuestions}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                onDuplicate={handleDuplicateQuestion}
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
