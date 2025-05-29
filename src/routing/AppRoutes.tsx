
import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import SignalePage from "@/pages/SignalePage";
import BetriebsdienstPage from "@/pages/BetriebsdienstPage";
import ProgressPage from "@/pages/ProgressPage";
import PrivacyPage from "@/pages/legal/PrivacyPage";
import TermsPage from "@/pages/legal/TermsPage";
import ImprintPage from "@/pages/legal/ImprintPage";
import Dashboard from "@/pages/Dashboard";
import CardsPage from "@/pages/CardsPage";
import LearningPage from "@/pages/LearningPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import RegulationSelectionPage from "@/pages/RegulationSelectionPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { authRoutes } from "./routes/auth-routes";
import { adminRoutes } from "../admin/routes/admin-routes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signale" element={<SignalePage />} />
      <Route path="/betriebsdienst" element={<BetriebsdienstPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      
      {/* Legal routes */}
      <Route path="/legal/privacy" element={<PrivacyPage />} />
      <Route path="/legal/terms" element={<TermsPage />} />
      <Route path="/legal/imprint" element={<ImprintPage />} />
      
      {/* Auth routes */}
      {authRoutes}
      
      {/* Cards and Learning routes - Updated to German structure */}
      <Route path="/karteikarten" element={<CardsPage />} />
      <Route path="/karteikarten/lernen" element={<LearningPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/fortschritt" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      <Route path="/einstellungen" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/regulation-selection" element={<ProtectedRoute><RegulationSelectionPage /></ProtectedRoute>} />
      
      {/* Legacy route redirects for backwards compatibility */}
      <Route path="/cards" element={<CardsPage />} />
      <Route path="/learning" element={<LearningPage />} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Admin routes - Clean modern system */}
      {adminRoutes}
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
