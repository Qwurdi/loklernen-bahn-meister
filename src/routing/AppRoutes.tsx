import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import SignalePage from "@/pages/SignalePage";
import BetriebsdienstPage from "@/pages/BetriebsdienstPage";
import CardsPage from "@/pages/CardsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ImprintPage from "@/pages/ImprintPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import RequestPasswordResetPage from "@/pages/RequestPasswordResetPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import AdminPage from "@/pages/AdminPage";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminQuestionsPage from "@/pages/AdminQuestionsPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminQuestionEditPage from "@/pages/AdminQuestionEditPage";
import AdminQuestionCreatePage from "@/pages/AdminQuestionCreatePage";
import AdminCategoryEditPage from "@/pages/AdminCategoryEditPage";
import AdminCategoryCreatePage from "@/pages/AdminCategoryCreatePage";
import AdminUserEditPage from "@/pages/AdminUserEditPage";
import AdminUserCreatePage from "@/pages/AdminUserCreatePage";
import AdminImportPage from "@/pages/AdminImportPage";
import AdminExportPage from "@/pages/AdminExportPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import FlashcardPage from "@/pages/FlashcardPage";
import LearningSessionPage from "@/pages/LearningSessionPage";
import MobileFlashcardPage from "@/components/flashcards/mobile/MobileFlashcardPage";
import { useIsMobile } from "@/hooks/use-mobile";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const FlashcardRoute = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileFlashcardPage /> : <FlashcardPage />;
};

export default function AppRoutes() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/imprint" element={<ImprintPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
      <Route path="/karteikarten" element={<CardsPage />} />
      <Route path="/karteikarten/signale" element={<SignalePage />} />
      <Route path="/karteikarten/betriebsdienst" element={<BetriebsdienstPage />} />
      <Route path="/karteikarten/lernen" element={<FlashcardRoute />} /> {/* Changed to new route component */}
      <Route path="/karteikarten/box/:boxIndex" element={<LearningSessionPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute adminOnly>
            <AdminCategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories/create"
        element={
          <ProtectedRoute adminOnly>
            <AdminCategoryCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminCategoryEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute adminOnly>
            <AdminQuestionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions/create"
        element={
          <ProtectedRoute adminOnly>
            <AdminQuestionCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/questions/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminQuestionEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/create"
        element={
          <ProtectedRoute adminOnly>
            <AdminUserCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminUserEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/import"
        element={
          <ProtectedRoute adminOnly>
            <AdminImportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/export"
        element={
          <ProtectedRoute adminOnly>
            <AdminExportPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
