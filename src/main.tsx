
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

console.log("Main: Starting application initialization");

// Detect any existing router instances (debugging)
const anyExistingRouter = document.querySelector('[data-reactroot]') !== null;
if (anyExistingRouter) {
  console.warn("Warning: Detected existing React root element before initialization");
}

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

console.log("Main: Creating React root element");
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found, cannot mount application");
} else {
  console.log("Main: Setting up single BrowserRouter instance");
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <UserPreferencesProvider>
                <TooltipProvider>
                  <App />
                </TooltipProvider>
              </UserPreferencesProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log("Main: Application rendered successfully");
}
