
import React from 'react';
import { AppHeader } from './AppHeader';
import { AppNavigation } from './AppNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Black header with logo */}
      <AppHeader />
      
      {/* Navigation */}
      <AppNavigation />
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
