
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RegulationFilterToggle } from '@/components/common/RegulationFilterToggle';
import { RegulationFilterType } from '@/types/regulation';
import { useIsMobile } from '@/hooks/use-mobile';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function SettingsPage() {
  const { regulationPreference, setRegulationPreference } = useUserPreferences();
  const isMobile = useIsMobile();

  const handleRegulationChange = (value: RegulationFilterType) => {
    setRegulationPreference(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
        <div className="container px-4 py-6">
          <h1 className="text-xl font-bold mb-6">Einstellungen</h1>
          
          <div className="space-y-6">
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
      {isMobile && <BottomNavigation />}
    </div>
  );
}
