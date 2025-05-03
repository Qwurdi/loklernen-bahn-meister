
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
    let isMounted = true;
    
    async function initializeAuth() {
      try {
        // First set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!isMounted) return;
            
            if (event === 'SIGNED_IN' && !loading) {
              toast.success('Erfolgreich angemeldet!');
              
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

        // Then check for existing session to initialize state
        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setLoading(false);
        }

        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setLoading(false);
        }
        return () => { isMounted = false; };
      }
    }

    const cleanup = initializeAuth();
    return () => {
      // Call the cleanup function returned by initializeAuth
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);  // Empty dependency array means this effect runs once on mount

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const contextValue = {
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
