
import { User } from "@supabase/supabase-js";

declare module "@/contexts/AuthContext" {
  export interface AuthContextType {
    user: User & { isAdmin?: boolean } | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    isAdmin?: boolean;
    session: any;
    isNewUser: boolean;
    setIsNewUser: (value: boolean) => void;
  }
}
