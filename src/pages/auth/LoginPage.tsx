
import React from 'react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-headline-large">
            <span className="text-black">Lok</span>
            <span className="text-[#3F00FF]">Lernen</span>
          </h1>
          <p className="mt-2 text-body-large text-gray-600">
            Bei deinem Konto anmelden
          </p>
        </div>
        
        <div className="material-card p-8">
          <p className="text-center text-body-medium text-gray-500">
            🚧 Login-Formular wird in Phase 1 implementiert
          </p>
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-[#3F00FF] hover:text-[#0F52BA] text-body-medium"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
