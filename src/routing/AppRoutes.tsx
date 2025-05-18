
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Import existing pages directly
import HomePage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import SignalePage from "@/pages/SignalePage";
import BetriebsdienstPage from "@/pages/BetriebsdienstPage";
import CardsPage from "@/pages/CardsPage";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import FlashcardPage from "@/pages/FlashcardPage";
import LearningSessionPage from "@/pages/LearningSessionPage";
import MobileFlashcardPage from "@/components/flashcards/mobile/MobileFlashcardPage";

// Placeholder components for pages that don't exist yet but are referenced
const AboutPage = () => <div>About Page</div>;
const PrivacyPage = () => <div>Privacy Policy</div>;
const ImprintPage = () => <div>Imprint</div>;
const VerifyEmailPage = () => <div>Verify Email</div>;
const ResetPasswordPage = () => <div>Reset Password</div>;
const RequestPasswordResetPage = () => <div>Request Password Reset</div>;
const ProfilePage = () => <div>Profile</div>;
const SettingsPage = () => <div>Settings</div>;
const AdminPage = () => <div>Admin</div>;
const AdminDashboardPage = () => <div>Admin Dashboard</div>;
const AdminCategoriesPage = () => <div>Admin Categories</div>;
const AdminQuestionsPage = () => <div>Admin Questions</div>;
const AdminUsersPage = () => <div>Admin Users</div>;
const AdminQuestionEditPage = () => <div>Edit Question</div>;
const AdminQuestionCreatePage = () => <div>Create Question</div>;
const AdminCategoryEditPage = () => <div>Edit Category</div>;
const AdminCategoryCreatePage = () => <div>Create Category</div>;
const AdminUserEditPage = () => <div>Edit User</div>;
const AdminUserCreatePage = () => <div>Create User</div>;
const AdminImportPage = () => <div>Import</div>;
const AdminExportPage = () => <div>Export</div>;

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
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
      <Route path="/karteikarten/lernen" element={<FlashcardRoute />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
