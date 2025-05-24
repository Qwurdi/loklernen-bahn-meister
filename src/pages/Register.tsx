
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signUp, user, authError, clearAuthError } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("Register: User already logged in, redirecting");
      navigate("/");
    }
  }, [user, navigate]);

  // Clear any previous auth errors when component mounts or unmounts
  useEffect(() => {
    clearAuthError();
    return () => clearAuthError();
  }, [clearAuthError]);

  // Update local error state when authError changes
  useEffect(() => {
    if (authError) {
      console.log("Register: Auth error detected:", authError);
      
      if (authError.message.includes("already registered")) {
        setError("Diese E-Mail-Adresse ist bereits registriert");
      } else if (authError.message.includes("password")) {
        setError("Das Passwort muss mindestens 6 Zeichen lang sein");
      } else {
        setError(authError.message || "Ein Fehler ist bei der Registrierung aufgetreten");
      }
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !agreeTerms) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log("Register: Attempting signup with email:", email);
      const { error } = await signUp(email, password);

      if (error) {
        console.error("Register: Error during sign up:", error);
        // Error is already set via useEffect monitoring authError
        toast.error(error.message || "Ein Fehler ist aufgetreten");
      } else {
        console.log("Register: Success, redirecting");
        // Set a flag to identify new users
        localStorage.setItem('isNewSignUp', 'true');
        
        toast.success('Registrierung erfolgreich! Bitte überprüfe deine E-Mails.');
        navigate("/regelwerk-auswahl"); // Redirect to regulation selection page
      }
    } catch (unexpectedError: any) {
      console.error("Register: Unexpected error:", unexpectedError);
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
              <h1 className="text-2xl font-bold">Konto erstellen</h1>
              <p className="text-muted-foreground mt-2">
                Registriere dich, um deinen Lernfortschritt zu speichern
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
                  autoComplete="new-password"
                />
                <p className="text-sm text-muted-foreground">
                  Mindestens 8 Zeichen
                </p>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  Ich stimme den{" "}
                  <Link to="/agb" className="text-loklernen-ultramarine hover:underline">
                    AGB
                  </Link>{" "}
                  und der{" "}
                  <Link to="/datenschutz" className="text-loklernen-ultramarine hover:underline">
                    Datenschutzerklärung
                  </Link>{" "}
                  zu
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
                disabled={loading || !agreeTerms}
              >
                {loading ? "Wird registriert..." : "Registrieren"}
              </Button>
              
              <div className="text-center text-sm">
                Bereits registriert?{" "}
                <Link to="/login" className="text-loklernen-ultramarine hover:underline">
                  Anmelden
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
