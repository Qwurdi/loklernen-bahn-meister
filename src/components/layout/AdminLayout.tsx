
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-provider";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">Lade...</div>
          <div className="text-gray-500">Bitte warten Sie, während wir den Administrationsbereich laden.</div>
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
