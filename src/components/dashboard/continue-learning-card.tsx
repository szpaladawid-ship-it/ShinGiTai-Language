import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ContinueLearningCourse = {
  languageName?: string;
  languageFlag?: string;
  level?: string;
  xp?: number;
};

type NextStepRecommendation = {
  label: string;
  description: string;
  cta: string;
  to: string;
};

type ContinueLearningCardProps = {
  course?: ContinueLearningCourse;
  currentStreak?: number;
  dailyGoalMinutes?: number;
  isLoading?: boolean;
};

function getNextStepRecommendation({
  course,
  currentStreak = 0,
  dailyGoalMinutes = 15,
}: Pick<ContinueLearningCardProps, "course" | "currentStreak" | "dailyGoalMinutes">): NextStepRecommendation {
  if (!course) {
    return {
      label: "Create your path",
      description: "Add a language first so ShinGiTai Language can build a focused practice loop.",
      cta: "Choose language",
      to: "/onboarding",
    };
  }

  if ((course.xp ?? 0) < 50) {
    return {
      label: "Build the base",
      description: "Start with AI Teacher to establish your first useful words and patterns.",
      cta: "Start lesson",
      to: "/teacher",
    };
  }

  if (currentStreak === 0 || dailyGoalMinutes <= 10) {
    return {
      label: "Quick review",
      description: "Protect momentum with a short flashcard session before heavier practice.",
      cta: "Review flashcards",
      to: "/flashcards",
    };
  }

  return {
    label: "Use it in speech",
    description: "You have enough base work for today. Move into tutor conversation and apply it.",
    cta: "Practice speaking",
    to: "/tutor",
  };
}

export function ContinueLearningCard({
  course,
  currentStreak,
  dailyGoalMinutes,
  isLoading,
}: ContinueLearningCardProps) {
  const hasCourse = Boolean(course);
  const recommendation = getNextStepRecommendation({ course, currentStreak, dailyGoalMinutes });
  const title = hasCourse
    ? `${course?.languageFlag ?? "🌐"} ${course?.languageName ?? "Current language"} · Level ${course?.level ?? "A1"}`
    : "Start your first language path";

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Continue learning</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-8 w-72" /> : title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {hasCourse
              ? `Pick up from your active course with ${course?.xp ?? 0} XP already earned.`
              : "Choose a language first, then ShinGiTai Language can guide your next lesson, review, and practice session."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Recommended next step</p>
          <h3 className="mt-2 font-semibold">{recommendation.label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p>
          <Button asChild variant="hero" className="mt-4 w-full">
            <Link to={recommendation.to}>
              {recommendation.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
