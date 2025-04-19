
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SignalePage from "./pages/SignalePage";
import FlashcardPage from "./pages/FlashcardPage";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signale" element={<SignalePage />} />
            <Route path="/signale/:subcategory" element={<FlashcardPage />} />
            <Route path="/betriebsdienst" element={<BetriebsdienstPage />} />
            <Route path="/fortschritt" element={<ProgressPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
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
