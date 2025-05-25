
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '../store/admin-store';
import { AdminSidebar2 } from './AdminSidebar2';
import { AdminHeader2 } from './AdminHeader2';
import { AdminCommandPalette } from './AdminCommandPalette';
import { generateCSSVars } from '../styles/admin-tokens';

export const AdminLayout2: React.FC = () => {
  const { user, loading } = useAuth();
  const { isLoading } = useAdminStore();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-gray-900">Lade...</div>
          <div className="text-gray-500">Admin Panel wird geladen...</div>
        </div>
      </div>
    );
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin privileges
  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Apply CSS custom properties
  const cssVars = generateCSSVars();
  
  return (
    <div 
      className="min-h-screen bg-gray-50 flex w-full"
      style={cssVars}
    >
      <AdminSidebar2 />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader2 />
        
        <main className="flex-1 p-6 overflow-auto">
          {isLoading && (
            <div className="fixed top-4 right-4 z-50">
              <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600">Lädt...</span>
              </div>
            </div>
          )}
          
          <Outlet />
        </main>
      </div>
      
      <AdminCommandPalette />
    </div>
  );
};
