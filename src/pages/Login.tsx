
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signIn, user, authError, clearAuthError } = useAuth();
  
  // Get the intended destination from location state, or default to "/"
  const from = (location.state as { from?: string })?.from || "/";

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("Login: User already logged in, redirecting to:", from);
      navigate(from);
    }
  }, [user, navigate, from]);

  // Clear any previous auth errors when component mounts or unmounts
  useEffect(() => {
    clearAuthError();
    return () => clearAuthError();
  }, [clearAuthError]);

  // Update local error state when authError changes
  useEffect(() => {
    if (authError) {
      console.log("Login: Auth error detected:", authError);
      
      if (authError.message.includes("Invalid login")) {
        setError("Ungültige E-Mail-Adresse oder Passwort");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Bitte bestätigen Sie Ihre E-Mail-Adresse");
      } else {
        setError(authError.message || "Ein Fehler ist bei der Anmeldung aufgetreten");
      }
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log("Login: Attempting login with email:", email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Login: Error during sign in:", error);
        
        // Error is already set via useEffect monitoring authError
        toast.error(error.message || "Ein Fehler ist aufgetreten");
      } else {
        console.log("Login: Success, redirecting to:", from);
        // Navigation will happen via useEffect when user state updates
      }
    } catch (unexpectedError: any) {
      console.error("Login: Unexpected error:", unexpectedError);
      setError(unexpectedError.message || "Ein unerwarteter Fehler ist aufgetreten");
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 pb-24">
        <div className="container max-w-md px-4">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Anmelden</h1>
              <p className="text-muted-foreground mt-2">
                Melde dich an, um deinen Lernfortschritt zu speichern
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
                disabled={loading}
              >
                {loading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
              
              <div className="text-center text-sm">
                Noch kein Konto?{" "}
                <Link to="/register" className="text-loklernen-ultramarine hover:underline">
                  Jetzt registrieren
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
      <BottomNavigation />
    </div>
  );
}
