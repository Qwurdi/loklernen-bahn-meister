
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would integrate with Supabase auth
    console.log("Registration attempt with:", { name, email, password, agreeTerms });
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Konto erstellen</h1>
              <p className="text-muted-foreground mt-2">
                Melde dich an, um deinen Lernfortschritt zu speichern und auf weitere Kurse zuzugreifen
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <p className="text-sm text-muted-foreground">
                  Mindestens 8 Zeichen, 1 Großbuchstabe, 1 Zahl
                </p>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-1"
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
                disabled={!agreeTerms}
              >
                Registrieren
              </Button>
              
              <div className="text-center text-sm">
                Du hast bereits ein Konto?{" "}
                <Link to="/login" className="text-loklernen-ultramarine hover:underline">
                  Anmelden
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
