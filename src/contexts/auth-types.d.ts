
import { User } from "@supabase/supabase-js";

declare module "@/contexts/AuthContext" {
  export interface AuthContextType {
    user: User & { isAdmin?: boolean } | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ data?: any, error: Error | null }>;
    signUp: (email: string, password: string) => Promise<{ data?: any, error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    isAdmin?: boolean;
    session: any;
    isNewUser: boolean;
    setIsNewUser: (value: boolean) => void;
    authError: Error | null;
    clearAuthError: () => void;
  }
}
