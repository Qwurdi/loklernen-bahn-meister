
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RegulationFilterToggle } from '@/components/common/RegulationFilterToggle';
import { RegulationFilterType } from '@/types/regulation';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { regulationPreference, setRegulationPreference } = useUserPreferences();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleRegulationChange = (value: RegulationFilterType) => {
    setRegulationPreference(value);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        <div className="container px-4 py-6">
          <h1 className="text-xl font-bold mb-6">Einstellungen</h1>
          
          <div className="space-y-6">
            {/* User Email Info if logged in */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Angemeldet als: {user.email}
                  </p>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    className="mt-4"
                  >
                    Abmelden
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Regulation Preference Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regelwerk-Präferenz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Wähle das Regelwerk, mit dem du hauptsächlich arbeiten möchtest.
                  Dies beeinflusst die angezeigten Signale und Karteikarten.
                </p>
                <RegulationFilterToggle 
                  value={regulationPreference}
                  onChange={handleRegulationChange}
                  showInfoTooltip={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
      <BottomNavigation />
    </div>
  );
}
