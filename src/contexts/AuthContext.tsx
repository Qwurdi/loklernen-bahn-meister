
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
    // Initial setup - flag to prevent memory leaks
    let mounted = true;

    // Setup auth listener first
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // Only update state if the component is still mounted
      if (!mounted) return;

      // Show notifications for login/logout events (but not on initial load)
      if (!loading) {
        if (event === 'SIGNED_IN') {
          toast.success('Erfolgreich angemeldet!');
          
          // Check for new sign up
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
      }

      // Update state
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        // Only update state if component is still mounted
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mounted) setLoading(false);
      }
    };

    // Call get initial session
    getInitialSession();

    // Cleanup function - runs when component unmounts
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Context value - all the values we want to expose
  const value = {
    session,
    user,
    loading,
    signOut,
    isNewUser,
    setIsNewUser
  };

  return (
    <AuthContext.Provider value={value}>
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
