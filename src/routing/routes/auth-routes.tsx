
import React from "react";
import { Route } from "react-router-dom";

// Import pages
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";

// Placeholder components for auth pages
const VerifyEmailPage = () => <div>Verify Email</div>;
const ResetPasswordPage = () => <div>Reset Password</div>;
const RequestPasswordResetPage = () => <div>Request Password Reset</div>;

// Authentication-related routes
export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
  </>
);
