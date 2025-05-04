
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import AppRoutes from "@/routing/AppRoutes";
import { TooltipProvider } from "@/components/ui/tooltip";

console.log("App: Initializing application component");

// Create a QueryClient with optimized configuration to prevent unnecessary reloads
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Only retry once on failure
    },
  },
});

const App = () => {
  console.log("App: Rendering main application structure");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserPreferencesProvider>
          <TooltipProvider delayDuration={300}>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
