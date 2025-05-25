
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Command, Bell, User, Plus } from 'lucide-react';
import { useAdminStore } from '../../store/admin-store';
import { Button } from '@/components/ui/button';

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
  const { searchQuery, setSearch, commandInProgress, execute } = useAdminStore();
  
  const currentTitle = routeTitles[location.pathname] || 'Admin';
  
  const handleQuickCreate = () => {
    execute({
      type: 'QUESTION_CREATE',
      payload: {
        category: 'Signale',
        sub_category: 'Haupt- und Vorsignale',
        question_type: 'open',
        difficulty: 1,
        text: 'Neue Frage',
        answers: [],
        created_by: 'admin',
        revision: 1
      }
    });
  };

  const openCommandPalette = () => {
    // Trigger command palette via keyboard event
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    }));
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Title & Breadcrumb */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{currentTitle}</h1>
          <p className="text-sm text-gray-500 mt-1 truncate">
            Admin Panel 2.0 / {currentTitle}
          </p>
        </div>
        
        {/* Search & Actions */}
        <div className="flex items-center gap-3 ml-4">
          {/* Enhanced Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F00FF] focus:border-transparent transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="hidden lg:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
          
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={openCommandPalette}
          >
            <Search size={20} />
          </Button>

          {/* Quick Create */}
          <Button
            onClick={handleQuickCreate}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white"
            disabled={commandInProgress}
          >
            <Plus size={16} />
            <span className="hidden md:inline">Neue Frage</span>
          </Button>
          
          {/* Command Palette Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCommandPalette}
            className="hidden sm:flex"
            title="Kommandopalette (⌘K)"
          >
            <Command size={20} />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User Menu */}
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
          
          {/* Command Progress Indicator */}
          {commandInProgress && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Ausführen...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
