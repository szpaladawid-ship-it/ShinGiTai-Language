import { Link } from "@tanstack/react-router";
import { Home, School, MessageCircle, Layers, ScrollText } from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/teacher", label: "Teacher", icon: School },
  { to: "/tutor", label: "Tutor", icon: MessageCircle },
  { to: "/flashcards", label: "Cards", icon: Layers },
  { to: "/exams", label: "Exams", icon: ScrollText },
] as const;

/**
 * Mobile-first bottom tab bar. Hidden on md+ where the AppHeader nav is shown.
 */
export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/dashboard" }}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground transition-colors",
              "[&.active]:text-primary",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
