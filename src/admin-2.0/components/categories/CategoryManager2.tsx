
import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/admin-store';
import { useToastSystem } from '../../hooks/useToastSystem';
import { ToastContainer } from '../ui/VisualFeedback';
import { Plus, FolderTree, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CategoryManager2: React.FC = () => {
  const { 
    categories, 
    loadCategories, 
    isLoading,
    execute
  } = useAdminStore();
  
  const { toasts, toast } = useToastSystem();
  
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
  const categoriesList = Object.values(categories);
  
  const handleCreateCategory = async () => {
    try {
      await execute({
        type: 'CATEGORY_CREATE',
        payload: {
          name: 'Neue Kategorie',
          description: 'Beschreibung der neuen Kategorie',
          parent_category: 'Signale',
          isPro: false,
          isPlanned: false
        },
        meta: {
          onSuccess: () => {
            toast.success('Kategorie erstellt', 'Die neue Kategorie wurde erfolgreich erstellt');
          },
          onError: (error) => {
            toast.error('Fehler beim Erstellen', error.message);
          }
        }
      });
    } catch (error) {
      toast.error('Fehler', 'Unerwarteter Fehler beim Erstellen der Kategorie');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategorien verwalten</h1>
          <p className="text-gray-600 mt-1">
            Organisieren Sie die Struktur Ihrer Lernkategorien
          </p>
        </div>
        
        <Button
          onClick={handleCreateCategory}
          className="flex items-center gap-2 bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white hover:shadow-lg transition-all"
          disabled={isLoading}
        >
          <Plus size={16} />
          Neue Kategorie
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{categoriesList.length}</div>
          <div className="text-sm text-gray-600">Gesamt Kategorien</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {categoriesList.filter(c => c.parent_category === 'Signale').length}
          </div>
          <div className="text-sm text-gray-600">Signal-Kategorien</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {categoriesList.filter(c => c.parent_category === 'Betriebsdienst').length}
          </div>
          <div className="text-sm text-gray-600">Betriebsdienst-Kategorien</div>
        </div>
      </div>
      
      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FolderTree size={20} />
            Kategorien Übersicht
          </h2>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : categoriesList.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FolderTree size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Kategorien gefunden</h3>
              <p className="text-gray-500 mb-6">Erstellen Sie Ihre erste Kategorie</p>
              <Button
                onClick={handleCreateCategory}
                className="bg-gradient-to-r from-[#3F00FF] to-[#0F52BA] text-white"
              >
                Erste Kategorie erstellen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categoriesList.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${category.parent_category === 'Signale' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                        }
                      `}>
                        {category.parent_category}
                      </span>
                      {category.isPro && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};
