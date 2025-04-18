
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

const Index = () => {
  const { session, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Erfolgreich abgemeldet");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        {session ? (
          <>
            <h1 className="text-4xl font-bold mb-4">
              Willkommen bei LokLernen!
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Angemeldet als: {session.user.email}
            </p>
            <Button onClick={handleLogout} variant="outline">
              Abmelden
            </Button>
          </>
        ) : (
          <h1 className="text-4xl font-bold mb-4">
            Bitte melden Sie sich an
          </h1>
        )}
      </div>
    </div>
  );
};

export default Index;
