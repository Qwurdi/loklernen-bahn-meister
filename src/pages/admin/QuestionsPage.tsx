
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Book, 
  FileQuestion 
} from "lucide-react";
import QuestionTableRow from "@/components/admin/QuestionTableRow";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: questions, isLoading, error } = useQuestions();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "Signale" | "Betriebsdienst">("all");
  
  // Filter questions based on search query and category filter
  const filteredQuestions = questions?.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.sub_category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
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
            variant={categoryFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("all")}
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            Alle
          </Button>
          <Button 
            variant={categoryFilter === "Signale" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("Signale")}
          >
            <Book className="mr-2 h-4 w-4" />
            Signale
          </Button>
          <Button 
            variant={categoryFilter === "Betriebsdienst" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("Betriebsdienst")}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Betriebsdienst
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Frage</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Unterkategorie</TableHead>
                <TableHead className="text-center">Typ</TableHead>
                <TableHead className="text-center">Schwierigkeit</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions && filteredQuestions.length > 0 ? (
                filteredQuestions.map((question, index) => (
                  <QuestionTableRow 
                    key={question.id} 
                    question={question} 
                    index={index} 
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Keine Fragen gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
