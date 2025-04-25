
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CardsPage from "./pages/CardsPage";
import FlashcardPage from "./pages/FlashcardPage";
import LearningSessionPage from "./pages/LearningSessionPage";
import BetriebsdienstPage from "./pages/BetriebsdienstPage";
import ProgressPage from "./pages/ProgressPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import QuestionsPage from "./pages/admin/QuestionsPage";
import QuestionEditorPage from "./pages/admin/QuestionEditorPage";
import DeleteQuestionPage from "./pages/admin/DeleteQuestionPage";

const queryClient = new QueryClient();

// Route guard component for authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Lädt...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Route guard component that redirects authenticated users to dashboard
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Lädt...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Home route component to handle conditional rendering
const HomeRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Lädt...</div>;
  }
  
  return user ? <Dashboard /> : <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home route - dashboard for authenticated users, landing page for others */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/welcome" element={<Index />} />
            
            {/* Renamed Flashcard Routes */}
            <Route path="/karteikarten" element={<CardsPage />} />
            <Route path="/karteikarten/signale/:subcategory" element={<FlashcardPage />} />
            <Route path="/karteikarten/lernen" element={<ProtectedRoute><LearningSessionPage /></ProtectedRoute>} />
            <Route path="/karteikarten/betriebsdienst" element={<BetriebsdienstPage />} />
            <Route path="/karteikarten/betriebsdienst/:subcategory" element={<FlashcardPage />} />
            
            {/* Legacy redirect routes */}
            <Route path="/signale" element={<Navigate to="/karteikarten" replace />} />
            <Route path="/signale/:subcategory" element={<Navigate to="/karteikarten/signale/:subcategory" replace />} />
            <Route path="/betriebsdienst" element={<Navigate to="/karteikarten/betriebsdienst" replace />} />
            
            {/* Progress Page */}
            <Route path="/fortschritt" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="questions" element={<QuestionsPage />} />
              <Route path="questions/create" element={<QuestionEditorPage />} />
              <Route path="questions/edit/:id" element={<QuestionEditorPage />} />
              <Route path="questions/delete/:id" element={<DeleteQuestionPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
