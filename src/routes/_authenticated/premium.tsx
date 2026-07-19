import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Crown, Sparkles, Zap, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { getMyAccount, setSubscription } from "@/lib/account.functions";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/premium")({
  component: PremiumPage,
});

const FREE_FEATURES = [
  { label: "Daily lessons & quizzes", included: true },
  { label: "Basic flashcards (SRS)", included: true },
  { label: "Limited AI tutor messages", included: true },
  { label: "Ads between lessons", included: false },
  { label: "Unlimited hearts", included: false },
  { label: "Offline downloads", included: false },
];

const PRO_FEATURES = [
  "Unlimited AI tutor conversations",
  "Unlimited hearts — never wait",
  "AI flashcard generation",
  "Advanced grammar & analytics",
  "Ad-free experience",
  "Priority support",
];

function PremiumPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const { data: account, isLoading } = useQuery({
    queryKey: ["account", user?.id],
    enabled: !!user,
    queryFn: async () => await getMyAccount(),
  });

  const tier = account?.subscription?.tier ?? "free";
  const isPro = tier === "pro";

  const change = async (next: "free" | "pro") => {
    setBusy(true);
    try {
      await setSubscription({ data: { tier: next } });
      await queryClient.invalidateQueries({ queryKey: ["account", user?.id] });
      toast.success(next === "pro" ? "Welcome to Pro! 🎉" : "Subscription cancelled.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <Crown className="h-4 w-4" /> ShinGiTai Language Pro
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Learn faster, without limits
          </h1>
          <p className="mt-2 text-muted-foreground">
            Unlock unlimited AI practice and premium features.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-96 rounded-3xl" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">Free</h2>
              </div>
              <p className="mt-2 text-3xl font-bold">
                $0<span className="text-base font-medium text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-5 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={cn(!f.included && "text-muted-foreground")}>{f.label}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-6 w-full"
                disabled={!isPro || busy}
                onClick={() => change("free")}
              >
                {isPro ? "Downgrade to Free" : "Current plan"}
              </Button>
            </div>

            {/* Pro */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-card p-6 shadow-elegant">
              <div className="absolute right-0 top-0 rounded-bl-2xl gradient-brand px-3 py-1 text-xs font-bold text-primary-foreground">
                MOST POPULAR
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-gold" />
                <h2 className="text-xl font-bold">Pro</h2>
              </div>
              <p className="mt-2 text-3xl font-bold">
                $9.99<span className="text-base font-medium text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-5 space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 shrink-0 text-gold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="hero"
                className="mt-6 w-full"
                disabled={isPro || busy}
                onClick={() => change("pro")}
              >
                {isPro ? "✓ You're a Pro" : busy ? "Processing…" : "Upgrade to Pro"}
              </Button>
              {account?.subscription?.current_period_end && isPro && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Renews {new Date(account.subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo billing is active. Connect Stripe to charge real payments.
        </p>
      </main>
    </div>
  );
}
