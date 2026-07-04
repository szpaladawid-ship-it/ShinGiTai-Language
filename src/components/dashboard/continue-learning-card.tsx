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
  reason: string;
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
      description: "Pick one language first. After that, your dashboard can guide lessons, review, and practice in order.",
      reason: "No active course yet",
      cta: "Choose language",
      to: "/onboarding",
    };
  }

  if ((course.xp ?? 0) < 50) {
    return {
      label: "Build the base",
      description: "Start with AI Teacher to establish the first useful words and patterns for this course.",
      reason: "Early course progress",
      cta: "Start lesson",
      to: "/teacher",
    };
  }

  if (currentStreak === 0) {
    return {
      label: "Restart momentum",
      description: "Use a short flashcard review to make the next session easy to finish and easy to repeat tomorrow.",
      reason: "No active streak yet",
      cta: "Review flashcards",
      to: "/flashcards",
    };
  }

  if (dailyGoalMinutes <= 10) {
    return {
      label: "Win the short session",
      description: "Keep today lightweight with flashcards before moving into a longer lesson or conversation.",
      reason: `${dailyGoalMinutes}-minute daily goal`,
      cta: "Review flashcards",
      to: "/flashcards",
    };
  }

  return {
    label: "Use it in speech",
    description: "You have enough base work for today. Move into tutor conversation and make the language usable.",
    reason: "Ready for active practice",
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
              : "Choose a language first, then ShinGiTai Language can turn the dashboard into a guided practice path."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Recommended next step</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {recommendation.reason}
            </span>
          </div>
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
