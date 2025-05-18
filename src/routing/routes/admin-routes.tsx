
import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";

// Placeholder components for admin pages
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

// Admin routes (require admin privileges)
export const adminRoutes = (
  <>
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
  </>
);
