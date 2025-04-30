
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RegulationFilterToggle } from '@/components/common/RegulationFilterToggle';
import { Button } from '@/components/ui/button';
import { RegulationFilterType } from '@/types/regulation';

export default function RegulationSelectionPage() {
  const { regulationPreference, setRegulationPreference } = useUserPreferences();
  const navigate = useNavigate();

  const handleRegulationChange = (value: RegulationFilterType) => {
    setRegulationPreference(value);
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Willkommen bei LokLernen</CardTitle>
          <CardDescription className="pt-2">
            Wähle bitte das Regelwerk, mit dem du hauptsächlich arbeiten möchtest:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="py-2">
            <RegulationFilterToggle 
              value={regulationPreference}
              onChange={handleRegulationChange}
              title="Regelwerk auswählen"
              showInfoTooltip={true}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Diese Einstellung kannst du jederzeit in deinen Einstellungen ändern.
            </p>
          </div>
          
          <Button 
            onClick={handleContinue} 
            className="w-full bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
          >
            Weiter zum Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
