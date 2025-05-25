
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { AdminLayout2 } from '../components/layout/AdminLayout2';
import { AdminDashboard2 } from '../pages/AdminDashboard2';
import { QuestionsPage2 } from '../pages/QuestionsPage2';

// Admin 2.0 routes (new clean architecture)
export const adminRoutes2 = (
  <Route path="/admin-2.0" element={<ProtectedRoute adminOnly={true}><AdminLayout2 /></ProtectedRoute>}>
    <Route index element={<AdminDashboard2 />} />
    <Route path="questions" element={<QuestionsPage2 />} />
    <Route path="categories" element={<div>Categories 2.0 - Coming Soon</div>} />
    <Route path="import" element={<div>Import 2.0 - Coming Soon</div>} />
    <Route path="export" element={<div>Export 2.0 - Coming Soon</div>} />
    <Route path="database" element={<div>Database 2.0 - Coming Soon</div>} />
    <Route path="settings" element={<div>Settings 2.0 - Coming Soon</div>} />
  </Route>
);
