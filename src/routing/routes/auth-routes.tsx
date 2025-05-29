import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Import pages
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";

// Placeholder components for auth pages
const VerifyEmailPage = () => <div>E-Mail verifizieren</div>;
const ResetPasswordPage = () => <div>Passwort zurücksetzen</div>;
const RequestPasswordResetPage = () => <div>Passwort-Reset anfordern</div>;

// Auth route wrapper that redirects logged in users to home
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while loading to prevent flashes of redirected content
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Wird geladen...</div>;
  }
  
  // If user is logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise show the auth page
  return <>{children}</>;
};

// Authentication-related routes
export const authRoutes = (
  <>
    <Route 
      path="/login" 
      element={
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      } 
    />
    <Route 
      path="/register" 
      element={
        <AuthRoute>
          <RegisterPage />
        </AuthRoute>
      } 
    />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
  </>
);
