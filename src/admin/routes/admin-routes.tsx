
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboard } from '../pages/AdminDashboard';
import { QuestionsPage } from '../pages/QuestionsPage';

// Clean placeholder components for upcoming features
const CategoriesPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategorien</h1>
    <p className="text-gray-600">Kategorie-Verwaltung wird bald verfügbar sein.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <p className="text-blue-700 text-sm">🏗️ Diese Funktionalität wird in der nächsten Version implementiert.</p>
    </div>
  </div>
);

const UsersPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Benutzer</h1>
    <p className="text-gray-600">Benutzer-Verwaltung wird bald verfügbar sein.</p>
    <div className="mt-4 p-4 bg-green-50 rounded-lg">
      <p className="text-green-700 text-sm">👥 Benutzer-Management kommt in der nächsten Version.</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Einstellungen</h1>
    <p className="text-gray-600">Admin-Einstellungen werden bald verfügbar sein.</p>
    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
      <p className="text-purple-700 text-sm">⚙️ Erweiterte Einstellungen kommen in der nächsten Version.</p>
    </div>
  </div>
);

export const adminRoutes = (
  <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
    <Route index element={<AdminDashboard />} />
    <Route path="questions" element={<QuestionsPage />} />
    <Route path="categories" element={<CategoriesPage />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
