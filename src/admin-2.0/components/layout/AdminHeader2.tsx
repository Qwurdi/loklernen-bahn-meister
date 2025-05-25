
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Command, Bell, User } from 'lucide-react';
import { useAdminStore } from '../store/admin-store';

const routeTitles: Record<string, string> = {
  '/admin-2.0': 'Dashboard',
  '/admin-2.0/questions': 'Fragen',
  '/admin-2.0/categories': 'Kategorien',
  '/admin-2.0/import': 'Import',
  '/admin-2.0/export': 'Export',
  '/admin-2.0/database': 'Datenbank',
  '/admin-2.0/settings': 'Einstellungen'
};

export const AdminHeader2: React.FC = () => {
  const location = useLocation();
  const { searchQuery, setSearch, commandInProgress } = useAdminStore();
  
  const currentTitle = routeTitles[location.pathname] || 'Admin';
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title & Breadcrumb */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {location.pathname.split('/').slice(1).join(' / ')}
          </p>
        </div>
        
        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Suchen... (Strg+K für Kommandopalette)"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Command Palette Trigger */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Kommandopalette (Strg+K)"
          >
            <Command size={20} />
          </button>
          
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Menu */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <User size={20} />
          </button>
          
          {/* Command Progress Indicator */}
          {commandInProgress && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Ausführen...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
