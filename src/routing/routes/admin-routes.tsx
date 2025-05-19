import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";

// Admin routes (require admin privileges)
export const adminRoutes = (
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
);
