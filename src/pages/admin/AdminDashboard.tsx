
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart2, Users, BookOpen, FileText } from "lucide-react";
import { useQuestions } from "@/hooks/useQuestions";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { data: questions, isLoading, error } = useQuestions();
  
  // Count questions by category
  const signalQuestions = questions?.filter(q => q.category === "Signale")?.length || 0;
  const betriebsdienstQuestions = questions?.filter(q => q.category === "Betriebsdienst")?.length || 0;
  
  // Count questions by type
  const openQuestions = questions?.filter(q => q.question_type === "open")?.length || 0;
  const mcSingleQuestions = questions?.filter(q => q.question_type === "MC_single")?.length || 0;
  const mcMultiQuestions = questions?.filter(q => q.question_type === "MC_multi")?.length || 0;
  
  // Count questions by regulation
  const ds301Questions = questions?.filter(q => q.regulation_category === "DS 301" || q.regulation_category === "both")?.length || 0;
  const dv301Questions = questions?.filter(q => q.regulation_category === "DV 301" || q.regulation_category === "both")?.length || 0;
  const bothRegulationQuestions = questions?.filter(q => q.regulation_category === "both")?.length || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/questions/create" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Neue Frage erstellen
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Fragen</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Signale</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              {((signalQuestions / (questions?.length || 1)) * 100).toFixed(0)}% aller Fragen
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Betriebsdienst</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{betriebsdienstQuestions}</div>
            <p className="text-xs text-muted-foreground">
              {((betriebsdienstQuestions / (questions?.length || 1)) * 100).toFixed(0)}% aller Fragen
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fragetypen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs">Offene Fragen</span>
                <span className="text-xs font-medium">{openQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Multiple Choice (Single)</span>
                <span className="text-xs font-medium">{mcSingleQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">Multiple Choice (Multi)</span>
                <span className="text-xs font-medium">{mcMultiQuestions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional card for regulation information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regelwerke</CardTitle>
          <CardDescription>Übersicht der Fragen nach Regelwerk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">DS 301</span>
                <span>{ds301Questions}</span>
              </div>
              <Progress value={(ds301Questions / (questions?.length || 1)) * 100} className="h-2" />
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">DV 301</span>
                <span>{dv301Questions}</span>
              </div>
              <Progress value={(dv301Questions / (questions?.length || 1)) * 100} className="h-2" />
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Beide Regelwerke</span>
                <span>{bothRegulationQuestions}</span>
              </div>
              <Progress value={(bothRegulationQuestions / (questions?.length || 1)) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="my-8 text-center">
          <p className="text-gray-500">Lade Daten...</p>
        </div>
      )}
      
      {error && (
        <div className="my-8 rounded-md bg-red-50 p-4 text-center">
          <p className="text-red-600">Fehler beim Laden der Daten. Bitte versuchen Sie es später noch einmal.</p>
        </div>
      )}
      
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Willkommen im Administrationsbereich</h2>
        <p className="text-gray-600">
          Hier können Sie Fragen erstellen, bearbeiten und löschen. Nutzen Sie die Navigation auf der linken Seite, 
          um zu den verschiedenen Bereichen zu navigieren.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
