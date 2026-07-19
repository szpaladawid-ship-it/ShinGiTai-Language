import { useMemo, useState } from "react";
import { createFileRoute, useParams, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Award, CheckCircle2, XCircle, ScrollText } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { getExamSession, getExamReview, submitExam } from "@/lib/exam.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/exams/$sessionId")({
  component: ExamSessionPage,
});

type Question = {
  id: string;
  order_index: number;
  section: string;
  prompt: string;
  options: string[];
  user_answer: number | null;
};

type ReviewQuestion = Question & { correct_index: number };

function ExamSessionPage() {
  const { sessionId } = useParams({ from: "/_authenticated/exams/$sessionId" });
  const navigate = useNavigate();
  const getFn = useServerFn(getExamSession);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["exam-session", sessionId],
    queryFn: () => getFn({ data: { id: sessionId } }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data || !data.session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
        <p className="text-muted-foreground">Exam not found.</p>
        <Button asChild variant="soft">
          <Link to="/exams">Back to exams</Link>
        </Button>
      </div>
    );
  }

  const session = data.session;
  const questions = (data.questions ?? []) as Question[];

  if (session.status === "completed") {
    return <ExamResult sessionId={sessionId} session={session} />;
  }

  return (
    <ExamRunner
      sessionId={sessionId}
      level={session.level}
      languageCode={session.language_code}
      questions={questions}
      onDone={() => navigate({ to: "/exams/$sessionId", params: { sessionId } })}
    />
  );
}

function ExamRunner({
  sessionId,
  level,
  languageCode,
  questions,
  onDone,
}: {
  sessionId: string;
  level: string;
  languageCode: string;
  questions: Question[];
  onDone: () => void;
}) {
  const submitFn = useServerFn(submitExam);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map((q) => (typeof q.user_answer === "number" ? q.user_answer : null)),
  );
  const [submitting, setSubmitting] = useState(false);

  const total = questions.length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const q = questions[current];

  const select = (idx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (answeredCount < total) {
      toast.error("Please answer every question before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await submitFn({ data: { id: sessionId, answers } });
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not submit the exam");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <Link
            to="/exams"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Exit exam
          </Link>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {languageCode.toUpperCase()} · {level}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Question {current + 1} of {total}
            </span>
            <span>{answeredCount} answered</span>
          </div>
          <Progress value={((current + 1) / total) * 100} className="mt-2 h-2" />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{q.section}</p>
          <h2 className="mt-2 whitespace-pre-line text-lg font-semibold">{q.prompt}</h2>

          <div className="mt-5 space-y-2.5">
            {q.options.map((opt, idx) => {
              const selected = answers[current] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => select(idx)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary/10 font-medium text-foreground"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border",
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          >
            Previous
          </Button>
          {current < total - 1 ? (
            <Button variant="soft" onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}>
              Next
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit exam
            </Button>
          )}
        </div>

        {/* Quick jump grid */}
        <div className="mt-6 flex flex-wrap gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={cn(
                "h-9 w-9 rounded-lg border text-sm font-medium transition-colors",
                idx === current
                  ? "border-primary bg-primary text-primary-foreground"
                  : answers[idx] !== null
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExamResult({
  sessionId,
  session,
}: {
  sessionId: string;
  session: {
    id: string;
    level: string;
    language_code: string;
    score_percent: number;
    passed: boolean;
    correct_count: number;
    total_questions: number;
    completed_at: string | null;
  };
}) {
  const reviewFn = useServerFn(getExamReview);
  const { data: review } = useQuery({
    queryKey: ["exam-review", sessionId],
    queryFn: () => reviewFn({ data: { id: sessionId } }),
  });
  const reviewQuestions = (review?.questions ?? []) as ReviewQuestion[];
  const { user } = useAuth();
  const name = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Learner";
  const date = useMemo(
    () =>
      session.completed_at
        ? new Date(session.completed_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    [session.completed_at],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/exams"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to exams
        </Link>

        {session.passed ? (
          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-primary/5 p-8 text-center shadow-elegant">
            <Award className="mx-auto h-14 w-14 text-gold" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Certificate of Achievement
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">{name}</h1>
            <p className="mt-2 text-muted-foreground">
              has successfully passed the{" "}
              <span className="font-semibold text-foreground">
                {session.language_code.toUpperCase()} {session.level}
              </span>{" "}
              certification exam
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold/15 px-5 py-2 text-lg font-bold text-gold">
              {session.score_percent}% score
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              ShinGiTai Language · CEFR {session.level} · {date}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
            <XCircle className="mx-auto h-14 w-14 text-destructive" />
            <h1 className="mt-3 text-2xl font-bold tracking-tight">Not passed yet</h1>
            <p className="mt-2 text-muted-foreground">
              You scored {session.score_percent}% ({session.correct_count}/{session.total_questions}
              ). You need 60% to earn the {session.level} certificate. Keep studying and try again!
            </p>
            <Button asChild variant="hero" className="mt-5">
              <Link to="/exams">Try another exam</Link>
            </Button>
          </div>
        )}

        <h2 className="mt-10 flex items-center gap-2 text-xl font-bold tracking-tight">
          <ScrollText className="h-5 w-5 text-primary" /> Review
        </h2>
        <div className="mt-4 space-y-3">
          {reviewQuestions.map((q, i) => {
            const isCorrect = q.user_answer === q.correct_index;
            return (
              <div key={q.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <p className="text-sm font-medium">
                    {i + 1}. {q.prompt}
                  </p>
                </div>
                <div className="mt-2 space-y-1.5 pl-6">
                  {q.options.map((opt, idx) => {
                    const chosen = q.user_answer === idx;
                    const correct = q.correct_index === idx;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          correct
                            ? "bg-primary/10 font-medium text-foreground"
                            : chosen
                              ? "bg-destructive/10 font-medium text-foreground"
                              : "text-muted-foreground",
                        )}
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                        {correct && (
                          <span className="ml-2 text-xs font-semibold text-primary">Correct</span>
                        )}
                        {chosen && !correct && (
                          <span className="ml-2 text-xs text-destructive">Your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
