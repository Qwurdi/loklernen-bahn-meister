
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Layout Components
import { AppLayout } from '@/components/layout/AppLayout';

// Page Components
import { HomePage } from '@/pages/HomePage';
import { CardsPage } from '@/pages/CardsPage';
import { LearningPage } from '@/pages/LearningPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Legal Pages
import { PrivacyPage } from '@/pages/legal/PrivacyPage';
import { ImprintPage } from '@/pages/legal/ImprintPage';
import { TermsPage } from '@/pages/legal/TermsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime)
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserPreferencesProvider>
          <TooltipProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
                  <Route path="/karteikarten" element={<AppLayout><CardsPage /></AppLayout>} />
                  <Route path="/karteikarten/lernen" element={<AppLayout><LearningPage /></AppLayout>} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
                  <Route path="/fortschritt" element={<AppLayout><ProgressPage /></AppLayout>} />
                  <Route path="/einstellungen" element={<AppLayout><SettingsPage /></AppLayout>} />
                  
                  {/* Legal Routes */}
                  <Route path="/datenschutz" element={<AppLayout><PrivacyPage /></AppLayout>} />
                  <Route path="/impressum" element={<AppLayout><ImprintPage /></AppLayout>} />
                  <Route path="/agb" element={<AppLayout><TermsPage /></AppLayout>} />
                </Routes>
              </div>
              <Toaster />
            </Router>
          </TooltipProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
