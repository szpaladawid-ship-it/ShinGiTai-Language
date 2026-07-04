import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Volume2, VolumeX, Square, Loader2, MessageCircle, UserRound, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { TeacherAvatar } from "@/components/teacher-avatar";
import { TeacherAvatarPicker } from "@/components/teacher-avatar-picker";
import { useSpeak } from "@/lib/use-speak";

function textOf(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function formatLanguageCode(code: string) {
  return code.trim().toUpperCase() || "LANGUAGE";
}

function lessonPhaseLabel(messageCount: number, isBusy: boolean) {
  if (isBusy) return "Teacher is responding";
  if (messageCount === 0) return "Ready to begin";
  if (messageCount < 4) return "Warm-up";
  return "In progress";
}

function teacherStarterPrompt(languageLabel: string, level: string) {
  return `Let's start my ${languageLabel} ${level} lesson. Give me a short explanation, then one small exercise.`;
}

export function TutorChatWindow({
  conversationId,
  initialMessages,
  title,
  languageCode,
  level,
  mode,
  avatarVariant,
}: {
  conversationId: string;
  initialMessages: UIMessage[];
  title: string;
  languageCode: string;
  level: string;
  mode: "conversation" | "teacher";
  avatarVariant?: string | null;
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { speak, stop, activeId, loadingId } = useSpeak();
  const [autoSpeak, setAutoSpeak] = useState(mode === "teacher");
  const lastSpokenRef = useRef<string | null>(null);
  const isTeacher = mode === "teacher";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: async ({ messages }) => {
          const { data } = await supabase.auth.getSession();
          return {
            headers: {
              Authorization: `Bearer ${data.session?.access_token ?? ""}`,
            },
            body: { messages, conversationId },
          };
        },
      }),
    [conversationId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
    onError: (e) => {
      const msg = e?.message ?? "";
      if (msg.includes("429")) toast.error("Too many requests. Please wait a moment.");
      else if (msg.includes("402")) toast.error("AI credits exhausted. Please add credits.");
      else toast.error("Something went wrong. Please try again.");
    },
    onFinish: () => {
      void queryClient.invalidateQueries({ queryKey: ["tutor-conversations"] });
      void queryClient.invalidateQueries({ queryKey: ["tutor-conversation", conversationId] });
      inputRef.current?.focus();
    },
  });

  const isBusy = status === "submitted" || status === "streaming";
  const safeTitle = title.trim() || (isTeacher ? "Guided lesson" : "Conversation practice");
  const safeLevel = level.trim() || "A1";
  const languageLabel = formatLanguageCode(languageCode);
  const phaseLabel = lessonPhaseLabel(messages.length, isBusy);
  const starterPrompt = teacherStarterPrompt(languageLabel, safeLevel);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversationId]);

  // Auto-speak the latest assistant reply when voice is enabled.
  useEffect(() => {
    if (!autoSpeak) return;
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (last.id === lastSpokenRef.current) return;
    const text = textOf(last);
    if (!text) return;
    lastSpokenRef.current = last.id;
    void speak(last.id, text);
  }, [messages, status, autoSpeak, speak]);

  const handleSubmit = (message: { text: string; files: unknown[] }, event: FormEvent) => {
    event.preventDefault();
    const text = message.text.trim();
    if (!text || isBusy) return;
    void sendMessage({ text });
  };

  const speaking = activeId !== null;
  const HeaderIcon = MessageCircle;

  return (
    <div className="flex h-full w-full flex-col">
      <header className="border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {isTeacher ? (
              <TeacherAvatar
                variant={avatarVariant}
                speaking={speaking}
                className="h-12 w-12 shrink-0"
              />
            ) : (
              <HeaderIcon className="h-5 w-5 shrink-0 text-primary" />
            )}
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h1 className="truncate text-base font-semibold">{safeTitle}</h1>
                {isTeacher && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <BookOpen className="h-3.5 w-3.5" /> Guided lesson
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                {languageLabel} · Level {safeLevel} · {phaseLabel}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {isTeacher && (
              <TeacherAvatarPicker
                trigger={
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Change teacher avatar">
                    <UserRound className="h-4 w-4" />
                  </Button>
                }
              />
            )}
            <Button
              type="button"
              variant={autoSpeak ? "soft" : "ghost"}
              size="sm"
              aria-pressed={autoSpeak}
              onClick={() => {
                if (autoSpeak) stop();
                setAutoSpeak((v) => !v);
              }}
            >
              {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="hidden sm:inline">{autoSpeak ? "Voice on" : "Voice off"}</span>
            </Button>
          </div>
        </div>

        {isTeacher && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border bg-card px-2.5 py-1">Follow the teacher prompt</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1">Answer in short steps</span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1">Ask for examples anytime</span>
          </div>
        )}
      </header>


      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 && (
            isTeacher ? (
              <div className="mx-auto max-w-xl py-10 text-center">
                <p className="text-sm font-semibold text-foreground">Ready for your first step?</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send the starter message below and the teacher will begin with a short explanation, one small exercise, and corrections after your answer.
                </p>
                <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-left shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Starter message</p>
                  <p className="mt-2 text-sm text-foreground">{starterPrompt}</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  You can also ask for easier examples, slower pacing, or more speaking practice at any time.
                </p>
              </div>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Say hello to start practicing! Try writing a greeting in your target language.
              </div>
            )
          )}
          {messages.map((m) => {
            const text = textOf(m);
            return (
              <Message from={m.role} key={m.id}>
                <MessageContent>
                  <MessageResponse>{text}</MessageResponse>
                </MessageContent>
                {m.role === "assistant" && text && (
                  <MessageActions>
                    <MessageAction
                      tooltip={activeId === m.id ? "Stop" : "Listen"}
                      onClick={() => (activeId === m.id ? stop() : speak(m.id, text))}
                    >
                      {loadingId === m.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : activeId === m.id ? (
                        <Square className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </MessageAction>
                  </MessageActions>
                )}
              </Message>
            );
          })}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-3">
        <PromptInput onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <PromptInputTextarea
            ref={inputRef}
            placeholder={isTeacher ? "Answer your teacher or ask a question…" : "Type your message…"}
            disabled={isBusy}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={isBusy} />
          </PromptInputFooter>
        </PromptInput>
        {error && (
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-destructive">
            Failed to get a response. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
