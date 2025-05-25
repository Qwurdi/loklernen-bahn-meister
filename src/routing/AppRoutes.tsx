
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTES } from "@/constants/routes";

// Import pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import CardsPage from "@/pages/CardsPage";
import LearningPage from "@/pages/LearningPage";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";

// Import legal pages
import PrivacyPage from "@/pages/legal/PrivacyPage";
import ImprintPage from "@/pages/legal/ImprintPage";
import TermsPage from "@/pages/legal/TermsPage";

// Placeholder components
const VerifyEmailPage = () => <div>E-Mail verifizieren</div>;
const ResetPasswordPage = () => <div>Passwort zurücksetzen</div>;
const RequestPasswordResetPage = () => <div>Passwort-Reset anfordern</div>;

export default function AppRoutes() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Index />} />
      
      {/* Auth routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      <Route path={ROUTES.REQUEST_PASSWORD_RESET} element={<RequestPasswordResetPage />} />
      
      {/* Legal pages - publicly accessible */}
      <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
      <Route path={ROUTES.IMPRINT} element={<ImprintPage />} />
      <Route path={ROUTES.TERMS} element={<TermsPage />} />
      
      {/* Protected user routes */}
      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path={ROUTES.CARDS} element={<ProtectedRoute><CardsPage /></ProtectedRoute>} />
      
      {/* Unified Learning Routes - All learning flows use the same LearningPage */}
      <Route path="/lernen" element={<LearningPage />} />
      <Route path={ROUTES.LEARNING} element={<LearningPage />} />
      <Route path="/karteikarten/session" element={<LearningPage />} />
      <Route path="/fullscreen-learning" element={<LearningPage />} />
      <Route path="/new-learning" element={<LearningPage />} />
      <Route path="/karteikarten/signale/:subcategory?" element={<LearningPage />} />
      <Route path="/karteikarten/betriebsdienst/:subcategory?" element={<LearningPage />} />
      
      <Route path={ROUTES.PROGRESS} element={<ProtectedRoute><div>Fortschritt</div></ProtectedRoute>} />
      <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><div>Einstellungen</div></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path={ROUTES.ADMIN} element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<div>Admin Categories</div>} />
        <Route path="categories/create" element={<div>Create Category</div>} />
        <Route path="categories/:id" element={<div>Edit Category</div>} />
        <Route path="questions" element={<div>Admin Questions</div>} />
        <Route path="questions/create" element={<div>Create Question</div>} />
        <Route path="questions/:id" element={<div>Edit Question</div>} />
        <Route path="users" element={<div>Admin Users</div>} />
        <Route path="users/create" element={<div>Create User</div>} />
        <Route path="users/:id" element={<div>Edit User</div>} />
        <Route path="import" element={<div>Import</div>} />
        <Route path="export" element={<div>Export</div>} />
      </Route>
      
      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
