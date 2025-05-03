
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Create a stable reference to loading state for closures
    let isInitializing = true;
    
    // First check for existing session to initialize state
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
        isInitializing = false;
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === 'SIGNED_IN') {
          // Only show toast for non-initial loads
          if (!isInitializing) {
            toast.success('Erfolgreich angemeldet!');
          }
          
          // Check if this is a new sign up
          if (!user) {
            const isSignUp = localStorage.getItem('isNewSignUp') === 'true';
            if (isSignUp) {
              setIsNewUser(true);
              localStorage.removeItem('isNewSignUp');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          toast.success('Erfolgreich abgemeldet!');
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Initialize session
    getInitialSession();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);  // No dependencies required here

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Create context value object outside of JSX to improve readability
  const contextValue: AuthContextType = {
    session, 
    user, 
    loading, 
    signOut,
    isNewUser,
    setIsNewUser
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
