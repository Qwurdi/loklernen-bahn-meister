
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function MobileEmptyState() {
  const navigate = useNavigate();
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="absolute top-2 left-2 z-10">
        <button 
          onClick={() => navigate('/karteikarten')}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-xs">
          <h3 className="text-xl font-bold text-white mb-3">Keine Karten verfügbar</h3>
          <p className="text-gray-300 mb-6">Für diese Kategorie sind aktuell keine Karten zum Lernen verfügbar.</p>
          <button 
            onClick={() => navigate('/karteikarten')}
            className="w-full py-3 bg-loklernen-ultramarine text-white rounded-lg"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    </div>
  );
}
