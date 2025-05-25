
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/routing/ProtectedRoute';
import { AdminLayout2 } from '../components/layout/AdminLayout2';
import { AdminDashboard2 } from '../pages/AdminDashboard2';
import { QuestionsPage2 } from '../pages/QuestionsPage2';
import { CategoriesPage2 } from '../pages/CategoriesPage2';

// Placeholder components for missing pages
const ImportPage2 = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Import 2.0</h1>
    <p className="text-gray-600">Diese Seite wird bald verfügbar sein.</p>
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-800 text-sm">
        📥 Import-Funktionalität für Fragen und Kategorien kommt in der nächsten Version.
      </p>
    </div>
  </div>
);

const ExportPage2 = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Export 2.0</h1>
    <p className="text-gray-600">Diese Seite wird bald verfügbar sein.</p>
    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
      <p className="text-green-800 text-sm">
        📤 Export-Funktionalität für Datenanalyse kommt in der nächsten Version.
      </p>
    </div>
  </div>
);

const DatabasePage2 = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Datenbank 2.0</h1>
    <p className="text-gray-600">Diese Seite wird bald verfügbar sein.</p>
    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <p className="text-purple-800 text-sm">
        🗄️ Datenbank-Verwaltung und Maintenance-Tools kommen in der nächsten Version.
      </p>
    </div>
  </div>
);

const SettingsPage2 = () => (
  <div className="bg-white rounded-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Einstellungen 2.0</h1>
    <p className="text-gray-600">Diese Seite wird bald verfügbar sein.</p>
    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
      <p className="text-orange-800 text-sm">
        ⚙️ Erweiterte Admin-Einstellungen kommen in der nächsten Version.
      </p>
    </div>
  </div>
);

// Admin 2.0 routes (new clean architecture)
export const adminRoutes2 = (
  <Route path="/admin-2.0" element={<ProtectedRoute adminOnly={true}><AdminLayout2 /></ProtectedRoute>}>
    <Route index element={<AdminDashboard2 />} />
    <Route path="questions" element={<QuestionsPage2 />} />
    <Route path="categories" element={<CategoriesPage2 />} />
    <Route path="import" element={<ImportPage2 />} />
    <Route path="export" element={<ExportPage2 />} />
    <Route path="database" element={<DatabasePage2 />} />
    <Route path="settings" element={<SettingsPage2 />} />
  </Route>
);
