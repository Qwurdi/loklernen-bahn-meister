
import { useEffect } from "react";
import AppRoutes from "./routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./styles/main.css";
import { useAuth } from "./contexts/AuthContext";
import { useNetworkStatus } from "./hooks/use-network-status";
import { registerBackgroundSync, syncOfflineData } from "./hooks/spaced-repetition/services";

// Register service worker for offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

function App() {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  
  // Effect to sync offline data when coming back online
  useEffect(() => {
    if (isOnline && user) {
      console.log("Online status detected, attempting to sync offline data");
      syncOfflineData(user.id).catch(error => {
        console.error("Error syncing offline data:", error);
      });
    }
  }, [isOnline, user]);
  
  // Register background sync when online
  useEffect(() => {
    if (isOnline) {
      registerBackgroundSync();
    }
  }, [isOnline]);
  
  return (
    <>
      <AppRoutes />
      <Toaster />
      <SonnerToaster position="top-center" closeButton richColors />
    </>
  );
}

export default App;
