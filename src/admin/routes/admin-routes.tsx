
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboard } from '../pages/AdminDashboard';
import { QuestionsPage } from '../pages/QuestionsPage';

// Placeholder components for missing pages
const CategoriesPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategorien</h1>
    <p className="text-gray-600">Kategorie-Verwaltung wird bald verfügbar sein.</p>
  </div>
);

const UsersPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Benutzer</h1>
    <p className="text-gray-600">Benutzer-Verwaltung wird bald verfügbar sein.</p>
  </div>
);

const ImportPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Import</h1>
    <p className="text-gray-600">Import-Funktionalität wird bald verfügbar sein.</p>
  </div>
);

const ExportPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Export</h1>
    <p className="text-gray-600">Export-Funktionalität wird bald verfügbar sein.</p>
  </div>
);

const DatabasePage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Datenbank</h1>
    <p className="text-gray-600">Datenbank-Verwaltung wird bald verfügbar sein.</p>
  </div>
);

const SettingsPage = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Einstellungen</h1>
    <p className="text-gray-600">Admin-Einstellungen werden bald verfügbar sein.</p>
  </div>
);

// New clean admin routes
export const newAdminRoutes = (
  <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
    <Route index element={<AdminDashboard />} />
    <Route path="questions" element={<QuestionsPage />} />
    <Route path="categories" element={<CategoriesPage />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="import" element={<ImportPage />} />
    <Route path="export" element={<ExportPage />} />
    <Route path="database" element={<DatabasePage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
