
import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import FlashcardPage from "@/pages/FlashcardPage";
import LearningSessionPage from "@/pages/LearningSessionPage";

// User-specific routes (require authentication)
export const userRoutes = (
  <>
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/karteikarten"
      element={
        <ProtectedRoute>
          <FlashcardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/lernen/*"
      element={
        <ProtectedRoute>
          <LearningSessionPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/fortschritt"
      element={
        <ProtectedRoute>
          <div>Fortschritt</div>
        </ProtectedRoute>
      }
    />
    <Route
      path="/einstellungen"
      element={
        <ProtectedRoute>
          <div>Einstellungen</div>
        </ProtectedRoute>
      }
    />
  </>
);
