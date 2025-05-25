
import React, { useEffect } from 'react';
import { useAdminStore } from '../store/admin-store';
import { Link } from 'react-router-dom';
import { FileText, FolderTree, TrendingUp, Users, Activity } from 'lucide-react';

export const AdminDashboard2: React.FC = () => {
  const { questions, categories, loadQuestions, loadCategories } = useAdminStore();
  
  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, [loadQuestions, loadCategories]);
  
  const questionCount = Object.keys(questions).length;
  const categoryCount = Object.keys(categories).length;
  
  // Quick stats
  const signalQuestions = Object.values(questions).filter(q => q.category === 'Signale').length;
  const betriebsdienstQuestions = Object.values(questions).filter(q => q.category === 'Betriebsdienst').length;
  
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Willkommen im Admin Panel 2.0</h1>
        <p className="text-blue-100">
          Moderne Verwaltung für LokLernen. Hier können Sie effizient Fragen und Kategorien verwalten.
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesamt Fragen</p>
              <p className="text-3xl font-bold text-gray-900">{questionCount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kategorien</p>
              <p className="text-3xl font-bold text-gray-900">{categoryCount}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FolderTree className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Signale</p>
              <p className="text-3xl font-bold text-gray-900">{signalQuestions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Betriebsdienst</p>
              <p className="text-3xl font-bold text-gray-900">{betriebsdienstQuestions}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="space-y-3">
            <Link
              to="/admin-2.0/questions"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Fragen verwalten</div>
                  <div className="text-sm text-gray-500">Erstellen, bearbeiten und organisieren</div>
                </div>
              </div>
            </Link>
            
            <Link
              to="/admin-2.0/categories"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">Kategorien verwalten</div>
                  <div className="text-sm text-gray-500">Struktur organisieren</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Datenbankverbindung</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aktiv</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cache Status</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Optimal</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Admin Panel 2.0 Features</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">✅ Unified State Management</div>
              <div className="text-sm text-gray-600">Zustand Store für konsistente Datenverwaltung</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">✅ Command System</div>
              <div className="text-sm text-gray-600">Alle Aktionen gehen durch ein einheitliches Command System</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">✅ Modern Design</div>
              <div className="text-sm text-gray-600">Clean UI mit LokLernen Design System</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">🚧 Command Palette (Strg+K)</div>
              <div className="text-sm text-gray-600">Schneller Zugriff auf alle Funktionen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
