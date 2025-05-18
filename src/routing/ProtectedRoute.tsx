
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Bitte melde dich an, um auf diese Seite zuzugreifen");
    }
  }, [user, loading]);

  // Show nothing while loading to prevent flashes of redirected content
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Wird geladen...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    toast.error("Zugriff verweigert. Du hast nicht die erforderlichen Rechte.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
