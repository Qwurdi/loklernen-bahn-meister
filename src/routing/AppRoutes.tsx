import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useIsMobile } from "@/hooks/use-mobile";

// Import pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import CardsPage from "@/pages/CardsPage";
import NewLearningPage from "@/pages/NewLearningPage";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import FullScreenLearningPage from "@/pages/FullScreenLearningPage";

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
      <Route path="/" element={<Index />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
      
      {/* Protected user routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/karteikarten" element={<ProtectedRoute><CardsPage /></ProtectedRoute>} />
      
      {/* New unified learning routes */}
      <Route path="/lernen" element={<FullScreenLearningPage />} />
      <Route path="/karteikarten/lernen" element={<FullScreenLearningPage />} />
      
      <Route path="/fortschritt" element={<ProtectedRoute><div>Fortschritt</div></ProtectedRoute>} />
      <Route path="/einstellungen" element={<ProtectedRoute><div>Einstellungen</div></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
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
      <Route path="*" element={<div>Seite nicht gefunden</div>} />
    </Routes>
  );
}
