
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Get the intended destination from location state, or default to "/"
  const from = (location.state as { from?: string })?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Login: Attempting login with email:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login: Success, redirecting to:", from);
      navigate(from);
    } catch (error: any) {
      console.error("Login catch block:", error);
      
      // Provide user-friendly error messages
      if (error.message.includes("Invalid login")) {
        setError("Ungültige E-Mail-Adresse oder Passwort");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Bitte bestätigen Sie Ihre E-Mail-Adresse");
      } else {
        setError(error.message || "Ein Fehler ist bei der Anmeldung aufgetreten");
      }
      
      toast.error(error.message || "Ein Fehler ist aufgetreten");
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
