import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  Moon,
  Sun,
  LogOut,
  Home,
  MessageCircle,
  Layers,
  BookOpen,
  GraduationCap,
  School,
  ScrollText,
  Trophy,
  Award,
  Crown,
  Shield,
} from "lucide-react";

import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { getMyAccount } from "@/lib/account.functions";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/teacher", label: "Teacher", icon: School },
  { to: "/tutor", label: "Tutor", icon: MessageCircle },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/grammar", label: "Grammar", icon: BookOpen },
  { to: "/quizzes", label: "Quizzes", icon: GraduationCap },
  { to: "/exams", label: "Exams", icon: ScrollText },
  { to: "/leaderboard", label: "Ranks", icon: Trophy },
  { to: "/achievements", label: "Badges", icon: Award },
] as const;

export function AppHeader() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: account } = useQuery({
    queryKey: ["account", user?.id],
    enabled: !!user,
    queryFn: async () => await getMyAccount(),
    staleTime: 60_000,
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            ShinGiTai Language
          </span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                "[&.active]:bg-primary/10 [&.active]:text-primary",
              )}
              activeOptions={{ exact: item.to === "/dashboard" }}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <NotificationBell />
          <Button asChild variant="ghost" size="icon" aria-label="Premium">
            <Link to="/premium">
              <Crown className="h-5 w-5 text-gold" />
            </Link>
          </Button>
          {account?.isAdmin && (
            <Button asChild variant="ghost" size="icon" aria-label="Admin">
              <Link to="/admin">
                <Shield className="h-5 w-5 text-primary" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
