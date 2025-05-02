
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";

// Eagerly load critical components
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazily load non-critical pages
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CardsPage = lazy(() => import("./pages/CardsPage"));
const FlashcardPage = lazy(() => import("./pages/FlashcardPage"));
const LearningSessionPage = lazy(() => import("./pages/LearningSessionPage"));
const BetriebsdienstPage = lazy(() => import("./pages/BetriebsdienstPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const RegulationSelectionPage = lazy(() => import("./pages/RegulationSelectionPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const QuestionsPage = lazy(() => import("./pages/admin/QuestionsPage"));
const QuestionEditorPage = lazy(() => import("./pages/admin/QuestionEditorPage"));
const DeleteQuestionPage = lazy(() => import("./pages/admin/DeleteQuestionPage"));

// Create a QueryClient with optimized configuration to prevent unnecessary reloads
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Only retry once on failure
    },
  },
});

// Route guard component for authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
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
    return <LoadingSpinner />;
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
    return <LoadingSpinner />;
  }
  
  return user ? <Dashboard /> : <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserPreferencesProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Home route - dashboard for authenticated users, landing page for others */}
                <Route path="/" element={<HomeRoute />} />
                <Route path="/welcome" element={<Index />} />
                
                {/* Regulation Selection Route */}
                <Route path="/regelwerk-auswahl" element={<ProtectedRoute><RegulationSelectionPage /></ProtectedRoute>} />
                <Route path="/einstellungen" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
