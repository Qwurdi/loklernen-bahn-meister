
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
  // Initialize state inside the component function body
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Mark component as mounted to prevent state updates after unmount
    let mounted = true;
    console.log("AuthContext: Initializing auth state");

    // Setup auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("AuthContext: Auth state changed:", event);
      if (!mounted) return;

      if (!loading) {
        if (event === 'SIGNED_IN') {
          toast.success('Erfolgreich angemeldet!');
          
          // New user check based on Supabase user attributes
          if (currentSession?.user) {
            const createdAt = currentSession.user.created_at;
            const lastSignInAt = currentSession.user.last_sign_in_at;

            if (createdAt && lastSignInAt) {
              const createdAtTime = new Date(createdAt).getTime();
              const lastSignInAtTime = new Date(lastSignInAt).getTime();
              // Consider as new user if last sign-in is very close to creation time (e.g., within 10 seconds)
              // This also implicitly handles the very first sign-in.
              if (Math.abs(lastSignInAtTime - createdAtTime) < 10000) { // 10 seconds threshold
                setIsNewUser(true);
              } else {
                setIsNewUser(false); // Explicitly set to false if not new
              }
            } else {
              // Fallback or if attributes are not available, assume not a new user for safety
              setIsNewUser(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          toast.success('Erfolgreich abgemeldet!');
          setIsNewUser(false); // Reset on sign out
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
        console.log("AuthContext: Getting initial session");
        const { data } = await supabase.auth.getSession();
        
        // Only update state if component is still mounted
        if (mounted) {
          console.log("AuthContext: Initial session loaded:", !!data.session);
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
      console.log("AuthContext: Cleaning up");
      mounted = false;
      subscription.unsubscribe();
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
