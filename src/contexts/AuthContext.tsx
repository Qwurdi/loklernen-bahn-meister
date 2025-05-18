
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
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    console.log("AuthContext: Initializing auth state");

    // Setup auth listener first before checking for existing session
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("AuthContext: Auth state changed:", event);
      if (!mounted) return;

      // Update session state first to ensure tokens are available
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Check if user is admin (temporary logic until proper roles are implemented)
        const isUserAdmin = currentSession.user.email === 'admin@example.com';
        
        // Update user with isAdmin property
        setUser({
          ...currentSession.user,
          isAdmin: isUserAdmin
        });
        
        setIsAdmin(isUserAdmin);
        
        // New user check based on Supabase user attributes
        const createdAt = currentSession.user.created_at;
        const lastSignInAt = currentSession.user.last_sign_in_at;

        if (createdAt && lastSignInAt) {
          const createdAtTime = new Date(createdAt).getTime();
          const lastSignInAtTime = new Date(lastSignInAt).getTime();
          // Consider as new user if last sign-in is very close to creation time (e.g., within 10 seconds)
          if (Math.abs(lastSignInAtTime - createdAtTime) < 10000) { // 10 seconds threshold
            setIsNewUser(true);
          } else {
            setIsNewUser(false); // Explicitly set to false if not new
          }
        } else {
          setIsNewUser(false);
        }
      } else {
        setUser(null);
        setIsAdmin(undefined);
        setIsNewUser(false);
      }

      // Display toast notifications only when not initially loading
      if (!loading) {
        if (event === 'SIGNED_IN') {
          toast.success('Erfolgreich angemeldet!');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Erfolgreich abgemeldet!');
        }
      }
      
      // Always set loading to false after processing auth state change
      setLoading(false);
    });

    // Get initial session after setting up listener
    const getInitialSession = async () => {
      try {
        console.log("AuthContext: Getting initial session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          setAuthError(error);
          if (mounted) setLoading(false);
          return;
        }
        
        // Only update state if component is still mounted
        if (mounted) {
          console.log("AuthContext: Initial session loaded:", !!data.session);
          
          // Update session first
          setSession(data.session);
          
          if (data.session?.user) {
            // Add isAdmin check for consistency
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
        console.error("Unexpected error getting initial session:", error);
        setAuthError(error as Error);
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

  // Improved signIn with better error handling
  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("AuthContext: Sign in error:", error);
        setAuthError(error);
        return { error };
      }
      
      console.log("AuthContext: Sign in successful");
      setAuthError(null);
      return { data, error: null };
    } catch (error) {
      console.error("AuthContext: Unexpected sign in error:", error);
      setAuthError(error as Error);
      return { error: error as Error };
    }
  };
  
  // Improved signUp with better error handling
  const signUp = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting sign up for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("AuthContext: Sign up error:", error);
        setAuthError(error);
        return { error };
      }
      
      console.log("AuthContext: Sign up successful");
      // Explicitly set isNewUser to true on successful signup
      setIsNewUser(true);
      setAuthError(null);
      return { data, error: null };
    } catch (error) {
      console.error("AuthContext: Unexpected sign up error:", error);
      setAuthError(error as Error);
      return { error: error as Error };
    }
  };
  
  // Improved signOut with better error handling
  const signOut = async () => {
    try {
      console.log("AuthContext: Attempting sign out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("AuthContext: Sign out error:", error);
        setAuthError(error);
        return { error };
      }
      
      console.log("AuthContext: Sign out successful");
      setAuthError(null);
      return { error: null };
    } catch (error) {
      console.error("AuthContext: Unexpected sign out error:", error);
      setAuthError(error as Error);
      return { error: error as Error };
    }
  };

  // Reset auth error
  const clearAuthError = () => {
    setAuthError(null);
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
    signUp,
    authError,
    clearAuthError
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
