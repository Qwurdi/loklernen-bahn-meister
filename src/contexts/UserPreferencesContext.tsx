import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RegulationCategory } from '@/types/questions';
import { toast } from 'sonner';

type UserPreferencesContextType = {
  regulationPreference: RegulationCategory;
  setRegulationPreference: (preference: RegulationCategory) => Promise<void>;
  loading: boolean;
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Local storage key for non-authenticated users
const REGULATION_PREFERENCE_KEY = 'loklernen-regulation-preference';

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [regulationPreference, setRegulationPreferenceState] = useState<RegulationCategory>('DS 301');
  const [loading, setLoading] = useState(true);

  // Load preference from storage/database on component mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        setLoading(true);
        
        // For logged in users, try to get preference from database
        if (user) {
          const { data, error } = await supabase
            .from('user_stats')
            .select('regulation_preference')
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('Error loading regulation preference:', error);
          }
          
          // If user has a preference stored in DB, use it
          if (data?.regulation_preference) {
            setRegulationPreferenceState(data.regulation_preference as RegulationCategory);
          } else {
            // Otherwise use local storage or default
            const storedPreference = localStorage.getItem(REGULATION_PREFERENCE_KEY) as RegulationCategory | null;
            setRegulationPreferenceState(storedPreference || 'DS 301');
          }
        } else {
          // For non-authenticated users, use local storage
          const storedPreference = localStorage.getItem(REGULATION_PREFERENCE_KEY) as RegulationCategory | null;
          setRegulationPreferenceState(storedPreference || 'DS 301');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreference();
  }, [user]);
  
  // Function to update preference
  const setRegulationPreference = async (preference: RegulationCategory) => {
    try {
      // Always store in local storage
      localStorage.setItem(REGULATION_PREFERENCE_KEY, preference);
      setRegulationPreferenceState(preference);
      
      // If user is logged in, also store in database
      if (user) {
        const { error } = await supabase
          .from('user_stats')
          .upsert({ 
            user_id: user.id, 
            regulation_preference: preference 
          }, { 
            onConflict: 'user_id' 
          });
          
        if (error) {
          console.error('Error saving regulation preference:', error);
          toast.error('Fehler beim Speichern der Regelwerk-Präferenz');
          return;
        }
      }
      
      toast.success(`Regelwerk auf ${preference} umgestellt`);
    } catch (error) {
      console.error('Error saving preference:', error);
      toast.error('Fehler beim Speichern der Regelwerk-Präferenz');
    }
  };
  
  return (
    <UserPreferencesContext.Provider value={{
      regulationPreference,
      setRegulationPreference,
      loading
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
}
