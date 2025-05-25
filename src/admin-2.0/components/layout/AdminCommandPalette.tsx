
import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/admin-store';

export const AdminCommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { execute } = useAdminStore();
  
  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Kommando eingeben..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-lg border-none outline-none"
            autoFocus
          />
        </div>
        
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-4">Verfügbare Kommandos:</div>
          
          <div className="space-y-2">
            <button
              onClick={() => {
                execute({ type: 'QUESTION_CREATE', payload: {} });
                setIsOpen(false);
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">Neue Frage erstellen</div>
              <div className="text-sm text-gray-500">Erstelle eine neue Frage</div>
            </button>
            
            <button
              onClick={() => {
                // Navigate to questions
                setIsOpen(false);
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">Zu Fragen navigieren</div>
              <div className="text-sm text-gray-500">Öffne die Fragenverwaltung</div>
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          Escape zum Schließen • Enter zum Ausführen
        </div>
      </div>
    </div>
  );
};
