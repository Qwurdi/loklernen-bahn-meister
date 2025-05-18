
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType } from "@/contexts/AuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User & { isAdmin?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    console.log("AuthContext: Initializing auth state");

    // Setup auth listener first
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
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
            
            // Check if user is admin (temporary logic until proper roles are implemented)
            // This is a placeholder - in a real app, you'd fetch this from a user_roles table or similar
            const isUserAdmin = currentSession.user.email === 'admin@example.com'; // Example check
            setIsAdmin(isUserAdmin);
            
            // Update user with isAdmin property
            setUser({
              ...currentSession.user,
              isAdmin: isUserAdmin
            });
          }
        } else if (event === 'SIGNED_OUT') {
          toast.success('Erfolgreich abgemeldet!');
          setIsNewUser(false); // Reset on sign out
          setIsAdmin(undefined);
        }
      }

      // Update session state
      setSession(currentSession);
      
      // Only update user if we're not setting it with isAdmin property above
      if (event !== 'SIGNED_IN') {
        setUser(currentSession?.user ?? null);
      }
      
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
          
          if (data.session?.user) {
            // Add isAdmin check here too for consistency
            const isUserAdmin = data.session.user.email === 'admin@example.com';
            setIsAdmin(isUserAdmin);
            setUser({
              ...data.session.user,
              isAdmin: isUserAdmin
            });
          } else {
            setUser(null);
          }
          
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
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  // Placeholder for signIn and signUp functions
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Context value - all the values we want to expose
  const value = {
    session,
    user,
    loading,
    signOut,
    isNewUser,
    setIsNewUser,
    isAdmin,
    signIn,
    signUp
  } as AuthContextType;

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
