
import React from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// List of admin emails - in a real production app, this would come from a database
const ADMIN_EMAILS = ['admin@example.com', 'busato@me.com'];

export interface AuthContextType {
  session: Session | null;
  user: (User & { isAdmin: boolean }) | null; // Modified to make isAdmin non-optional
  loading: boolean;
  isNewUser: boolean;
  setIsNewUser: (isNew: boolean) => void;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  authError: Error | null;
  clearAuthError: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<(User & { isAdmin: boolean }) | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isNewUser, setIsNewUser] = React.useState(false);
  const [authError, setAuthError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    // Set initial loading state
    setLoading(true);

    // Set up auth listener first to ensure we catch all auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event);
      setSession(currentSession);
      
      if (currentSession?.user) {
        const userEmail = currentSession.user.email || '';
        const userIsAdmin = ADMIN_EMAILS.includes(userEmail);
        
        // Set both user and isAdmin status in one go
        setUser({
          ...currentSession.user,
          isAdmin: userIsAdmin
        });
        
        // Check if this is a new user based on created_at and last_sign_in_at
        if (currentSession.user.created_at && currentSession.user.last_sign_in_at) {
          const createdAtTime = new Date(currentSession.user.created_at).getTime();
          const lastSignInAtTime = new Date(currentSession.user.last_sign_in_at).getTime();
          setIsNewUser(Math.abs(lastSignInAtTime - createdAtTime) < 10000);
        }
        
        if (event === 'SIGNED_IN' && !loading) {
          toast.success('Erfolgreich angemeldet!');
        }
      } else {
        setUser(null);
        setIsNewUser(false);
        
        if (event === 'SIGNED_OUT' && !loading) {
          toast.success('Erfolgreich abgemeldet!');
        }
      }
      
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        setAuthError(error);
        setLoading(false);
        return;
      }
      
      setSession(data.session);
      
      if (data.session?.user) {
        const userEmail = data.session.user.email || '';
        const userIsAdmin = ADMIN_EMAILS.includes(userEmail);
        
        setUser({
          ...data.session.user,
          isAdmin: userIsAdmin
        });
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setAuthError(error);
        return { error };
      }
      
      setAuthError(null);
      return { data, error: null };
    } catch (error) {
      setAuthError(error as Error);
      return { error };
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        setAuthError(error);
        return { error };
      }
      
      setIsNewUser(true);
      setAuthError(null);
      return { data, error: null };
    } catch (error) {
      setAuthError(error as Error);
      return { error };
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setAuthError(error);
        return { error };
      }
      
      setAuthError(null);
      return { error: null };
    } catch (error) {
      setAuthError(error as Error);
      return { error };
    }
  };

  const clearAuthError = () => setAuthError(null);

  const value: AuthContextType = {
    session,
    user,
    loading,
    signOut,
    isNewUser,
    setIsNewUser,
    signIn,
    signUp,
    authError,
    clearAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
