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

type ContinueLearningCardProps = {
  course?: ContinueLearningCourse;
  isLoading?: boolean;
};

export function ContinueLearningCard({ course, isLoading }: ContinueLearningCardProps) {
  const hasCourse = Boolean(course);
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
          <p className="text-sm font-semibold">Recommended next step</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasCourse ? "Continue with AI Teacher, then review flashcards." : "Add a language and complete onboarding."}
          </p>
          <Button asChild variant="hero" className="mt-4 w-full">
            <Link to={hasCourse ? "/teacher" : "/onboarding"}>
              {hasCourse ? "Continue lesson" : "Choose language"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
