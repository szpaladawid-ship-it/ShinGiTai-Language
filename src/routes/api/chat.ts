import { createFileRoute } from "@tanstack/react-router";
import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { buildLanguageSystemPrompt, completeLanguageAi } from "@/integrations/shingitai-openai";
import {
  buildLearningMemoryContext,
  getLearnerProfile,
  getRelevantMemories,
} from "@/features/language-memory";

type ChatRequestBody = { messages?: unknown; conversationId?: unknown };

function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as ChatRequestBody;
        if (!Array.isArray(body.messages))
          return new Response("Messages are required", { status: 400 });
        if (typeof body.conversationId !== "string")
          return new Response("conversationId is required", { status: 400 });

        const token = (request.headers.get("Authorization") ?? "")
          .replace(/^Bearer\s+/i, "")
          .trim();
        if (!token) return new Response("Unauthorized", { status: 401 });
        const supabase = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { headers: { Authorization: `Bearer ${token}` } },
          },
        );
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) return new Response("Unauthorized", { status: 401 });
        const userId = userData.user.id;

        const { data: conversation, error: conversationError } = await supabase
          .from("tutor_conversations")
          .select("id,language_code,level,title,mode")
          .eq("id", body.conversationId)
          .eq("user_id", userId)
          .maybeSingle();
        if (conversationError || !conversation)
          return new Response("Conversation not found", { status: 404 });

        const [{ data: language }, { data: profile }] = await Promise.all([
          supabase
            .from("languages")
            .select("name")
            .eq("code", conversation.language_code)
            .maybeSingle(),
          supabase.from("profiles").select("native_language_code").eq("id", userId).maybeSingle(),
        ]);
        let nativeName = "English";
        if (profile?.native_language_code) {
          const { data: native } = await supabase
            .from("languages")
            .select("name")
            .eq("code", profile.native_language_code)
            .maybeSingle();
          nativeName = native?.name ?? nativeName;
        }

        const uiMessages = body.messages as UIMessage[];
        const last = uiMessages.at(-1);
        const userText = last?.role === "user" ? messageText(last) : "";
        if (!userText) return new Response("A user message is required", { status: 400 });

        const { error: insertError } = await supabase.from("tutor_messages").insert({
          conversation_id: conversation.id,
          user_id: userId,
          role: "user",
          content: userText,
        });
        if (insertError) return new Response("Unable to save message", { status: 500 });
        if (
          !conversation.title.trim() ||
          conversation.title === "New conversation" ||
          conversation.title === "New lesson"
        ) {
          await supabase
            .from("tutor_conversations")
            .update({ title: userText.slice(0, 60) })
            .eq("id", conversation.id)
            .eq("user_id", userId);
        }

        let learnerMemory = "";
        let learnerProfile = null;
        try {
          [learnerProfile] = await Promise.all([
            getLearnerProfile({
              db: supabase,
              userId,
              targetLanguageCode: conversation.language_code,
            }),
          ]);
          const memories = await getRelevantMemories({
            db: supabase,
            userId,
            targetLanguageCode: conversation.language_code,
            mode: conversation.mode,
            limit: 10,
          });
          learnerMemory = buildLearningMemoryContext({ profile: learnerProfile, memories });
        } catch (error) {
          console.warn(
            "[Language memory] Read failed",
            error instanceof Error ? error.name : "UnknownError",
          );
        }

        const mode = conversation.mode === "teacher" ? "teacher" : "conversation";
        const system = buildLanguageSystemPrompt(mode, {
          targetLanguage: language?.name ?? conversation.language_code,
          nativeLanguage: nativeName,
          level: conversation.level,
          learningGoal: learnerProfile?.learning_goal,
          learnerMemory,
        });
        const messages = uiMessages
          .map((message) => ({
            role: message.role as "user" | "assistant",
            content: messageText(message),
          }))
          .filter((message) => message.content);

        const stream = createUIMessageStream({
          originalMessages: uiMessages,
          execute: async ({ writer }) => {
            // Automatic learning-outcome extraction is disabled until a verified extractor is implemented.
            const result = await completeLanguageAi({
              mode,
              targetLanguageCode: conversation.language_code,
              messages: [{ role: "system", content: system }, ...messages],
              signal: request.signal,
            });
            const textId = crypto.randomUUID();
            writer.write({ type: "text-start", id: textId });
            writer.write({ type: "text-delta", id: textId, delta: result.text });
            writer.write({ type: "text-end", id: textId });
            const { error } = await supabase.from("tutor_messages").insert({
              conversation_id: conversation.id,
              user_id: userId,
              role: "assistant",
              content: result.text,
            });
            if (error) console.error("[Tutor history] Assistant message persistence failed");
            await supabase
              .from("tutor_conversations")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", conversation.id)
              .eq("user_id", userId);
          },
          onError: () => "Language AI is temporarily unavailable.",
        });
        return createUIMessageStreamResponse({ stream });
      },
    },
  },
});
