
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";

interface WelcomeHeaderProps {
  completedToday: number;
}

export default function WelcomeHeader({ completedToday }: WelcomeHeaderProps) {
  const { user } = useAuth();
  const username = user?.user_metadata?.full_name || "";
  const today = formatDate(new Date());

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">
        {username ? `Willkommen zurück, ${username.split(' ')[0]}!` : "Willkommen zurück!"}
      </h1>
      <div className="flex flex-wrap gap-2 items-center text-muted-foreground">
        <span>{today}</span>
        {completedToday > 0 && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-loklernen-ultramarine mx-1"></span>
            <span className="font-medium text-loklernen-ultramarine">
              Heute bereits {completedToday} {completedToday === 1 ? 'Karte' : 'Karten'} gelernt
            </span>
          </>
        )}
      </div>
    </div>
  );
}
