import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Globe, Target, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { completeOnboarding } from "@/lib/account.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import onboardingImg from "@/assets/learn-onboarding.jpg";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: OnboardingPage,
});

const LEVELS = [
  { value: "A1", label: "A1 · Beginner", desc: "I'm starting from scratch" },
  { value: "A2", label: "A2 · Elementary", desc: "I know a few basics" },
  { value: "B1", label: "B1 · Intermediate", desc: "I can hold simple conversations" },
  { value: "B2", label: "B2 · Upper-Intermediate", desc: "I'm fairly comfortable" },
] as const;

const GOALS = [
  { value: 5, label: "Casual", desc: "5 min / day" },
  { value: 15, label: "Regular", desc: "15 min / day" },
  { value: 30, label: "Serious", desc: "30 min / day" },
  { value: 60, label: "Intense", desc: "60 min / day" },
] as const;

function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [nativeLang, setNativeLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("");
  const [level, setLevel] = useState<string>("A1");
  const [goal, setGoal] = useState<number>(15);
  const [submitting, setSubmitting] = useState(false);

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("code, name, native_name, flag_emoji")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const totalSteps = 4;
  const canNext =
    step === 0 ||
    (step === 1 && !!nativeLang) ||
    (step === 2 && !!targetLang && targetLang !== nativeLang) ||
    (step === 3 && !!goal);

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await completeOnboarding({
        data: {
          display_name: displayName.trim() || undefined,
          native_language_code: nativeLang,
          target_language_code: targetLang,
          level: level as "A1",
          daily_goal_minutes: goal,
        },
      });
      await queryClient.invalidateQueries();
      toast.success("You're all set! Let's learn.");
      navigate({ to: "/dashboard", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-2 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">ShinGiTai Language</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8">
        <Progress value={((step + 1) / totalSteps) * 100} className="h-2" />
        <p className="mt-2 text-sm text-muted-foreground">
          Step {step + 1} of {totalSteps}
        </p>

        <div className="mt-8 flex-1">
          {step === 0 && (
            <div className="animate-fade-up">
              <img
                src={onboardingImg}
                alt="Friendly character waving next to a signpost with country flags"
                loading="lazy"
                width={1024}
                height={1024}
                className="mx-auto mb-6 h-44 w-auto rounded-3xl object-contain"
              />
              <h1 className="text-3xl font-bold tracking-tight">Welcome! 👋</h1>
              <p className="mt-1 text-muted-foreground">
                Let's personalise your learning. First, what should we call you?
              </p>
              <Input
                className="mt-6 h-12 text-base"
                placeholder="Your name (optional)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
              />
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-up">
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                <Globe className="h-7 w-7 text-primary" /> Your language
              </h1>
              <p className="mt-1 text-muted-foreground">What language do you speak best?</p>
              <LangGrid
                languages={languages ?? []}
                selected={nativeLang}
                onSelect={setNativeLang}
              />
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                <Globe className="h-7 w-7 text-accent" /> What to learn
              </h1>
              <p className="mt-1 text-muted-foreground">Choose your first language to learn.</p>
              <LangGrid
                languages={(languages ?? []).filter((l) => l.code !== nativeLang)}
                selected={targetLang}
                onSelect={setTargetLang}
              />
              <p className="mt-6 font-semibold">Your current level</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      level === l.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <p className="font-semibold">{l.label}</p>
                    <p className="text-sm text-muted-foreground">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                <Target className="h-7 w-7 text-gold" /> Daily goal
              </h1>
              <p className="mt-1 text-muted-foreground">How much time can you commit each day?</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4 text-left transition-all",
                      goal === g.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div>
                      <p className="font-semibold">{g.label}</p>
                      <p className="text-sm text-muted-foreground">{g.desc}</p>
                    </div>
                    {goal === g.value && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < totalSteps - 1 ? (
            <Button
              variant="hero"
              size="lg"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="hero"
              size="lg"
              disabled={!canNext || submitting}
              onClick={handleFinish}
            >
              {submitting ? "Setting up…" : "Start learning"} <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function LangGrid({
  languages,
  selected,
  onSelect,
}: {
  languages: { code: string; name: string; native_name: string; flag_emoji: string }[];
  selected: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => onSelect(l.code)}
          className={cn(
            "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
            selected === l.code
              ? "border-primary bg-primary/5 ring-2 ring-primary/30"
              : "border-border hover:border-primary/50",
          )}
        >
          <span className="text-2xl">{l.flag_emoji}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{l.name}</p>
            <p className="truncate text-xs text-muted-foreground">{l.native_name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
