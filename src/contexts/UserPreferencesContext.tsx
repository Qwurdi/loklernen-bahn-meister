
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RegulationFilterType } from '@/types/regulation';
import { toast } from 'sonner';

type EditorViewType = 'tabs' | 'single';

type UserPreferencesContextType = {
  regulationPreference: RegulationFilterType;
  setRegulationPreference: (preference: RegulationFilterType) => Promise<void>;
  editorViewPreference: EditorViewType;
  setEditorViewPreference: (preference: EditorViewType) => Promise<void>;
  loading: boolean;
};

const UserPreferencesContext = React.createContext<UserPreferencesContextType | undefined>(undefined);

// Local storage keys for non-authenticated users
const REGULATION_PREFERENCE_KEY = 'loklernen-regulation-preference';
const EDITOR_VIEW_PREFERENCE_KEY = 'loklernen-editor-view-preference';

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [regulationPreference, setRegulationPreferenceState] = React.useState<RegulationFilterType>('DS 301');
  const [editorViewPreference, setEditorViewPreferenceState] = React.useState<EditorViewType>('tabs');
  const [loading, setLoading] = React.useState(true);

  // Load preferences from storage/database on component mount
  React.useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        
        // For logged in users, try to get preferences from database
        if (user) {
          const { data, error } = await supabase
            .from('user_stats')
            .select('regulation_preference, editor_view_preference')
            .eq('user_id', user.id)
            .single();
            
          if (error) {
            console.error('Error loading user preferences:', error);
            
            // Use local storage as fallback
            const storedRegPreference = localStorage.getItem(REGULATION_PREFERENCE_KEY) as RegulationFilterType | null;
            setRegulationPreferenceState(storedRegPreference || 'DS 301');
            
            const storedViewPreference = localStorage.getItem(EDITOR_VIEW_PREFERENCE_KEY) as EditorViewType | null;
            setEditorViewPreferenceState(storedViewPreference || 'tabs');
          } else if (data) {
            // Set regulation preference
            setRegulationPreferenceState((data.regulation_preference as RegulationFilterType) || 'DS 301');
            
            // Set editor view preference
            setEditorViewPreferenceState((data.editor_view_preference as EditorViewType) || 'tabs');
          }
        } else {
          // For non-authenticated users, use local storage
          const storedRegPreference = localStorage.getItem(REGULATION_PREFERENCE_KEY) as RegulationFilterType | null;
          setRegulationPreferenceState(storedRegPreference || 'DS 301');
          
          const storedViewPreference = localStorage.getItem(EDITOR_VIEW_PREFERENCE_KEY) as EditorViewType | null;
          setEditorViewPreferenceState(storedViewPreference || 'tabs');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        // Use defaults on any error
        setRegulationPreferenceState('DS 301');
        setEditorViewPreferenceState('tabs');
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [user]);
  
  // Function to update regulation preference
  const setRegulationPreference = async (preference: RegulationFilterType) => {
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

  // Function to update editor view preference
  const setEditorViewPreference = async (preference: EditorViewType) => {
    try {
      // Always store in local storage
      localStorage.setItem(EDITOR_VIEW_PREFERENCE_KEY, preference);
      setEditorViewPreferenceState(preference);
      
      // If user is logged in, also store in database
      if (user) {
        const { error } = await supabase
          .from('user_stats')
          .upsert({ 
            user_id: user.id, 
            editor_view_preference: preference 
          }, { 
            onConflict: 'user_id' 
          });
          
        if (error) {
          console.error('Error saving editor view preference:', error);
          toast.error('Fehler beim Speichern der Editor-Ansicht');
          return;
        }
      }
      
      toast.success(`Editor-Ansicht auf ${preference === 'tabs' ? 'Tabs' : 'Einzelansicht'} umgestellt`);
    } catch (error) {
      console.error('Error saving editor view preference:', error);
      toast.error('Fehler beim Speichern der Editor-Ansicht');
    }
  };
  
  return (
    <UserPreferencesContext.Provider value={{
      regulationPreference,
      setRegulationPreference,
      editorViewPreference,
      setEditorViewPreference,
      loading
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = React.useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
}
