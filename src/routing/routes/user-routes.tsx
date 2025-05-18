
import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";

// Placeholder components for user pages
const ProfilePage = () => <div>Profile</div>;
const SettingsPage = () => <div>Settings</div>;

// User-specific routes (require authentication)
export const userRoutes = (
  <>
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
  </>
);
