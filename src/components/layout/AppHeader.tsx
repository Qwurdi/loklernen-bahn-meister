
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-black text-white border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            <span className="text-white">Lok</span>
            <span className="text-[#3F00FF]">Lernen</span>
          </Link>
          
          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300">
                  Hallo, {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut()}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Abmelden
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-gray-800"
                >
                  <Link to="/login">Anmelden</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-gradient-ultramarine"
                >
                  <Link to="/register">Registrieren</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
