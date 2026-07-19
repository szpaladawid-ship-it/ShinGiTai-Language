import { createFileRoute } from "@tanstack/react-router";
import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  OdynAiLanguageClientError,
  completeOdynAiLanguageChat,
  type OdynAiLanguageMessage,
} from "@/integrations/odynai";

type ChatRequestBody = {
  messages?: unknown;
  conversationId?: unknown;
};

function isUiMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as {
    role?: unknown;
    parts?: unknown;
  };

  return (message.role === "user" || message.role === "assistant") && Array.isArray(message.parts);
}

function uiMessageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

function toOdynAiMessages(uiMessages: UIMessage[]): OdynAiLanguageMessage[] {
  const messages = uiMessages
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: uiMessageText(message),
    }))
    .filter((message) => message.content);

  return messages.slice(-40);
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as ChatRequestBody;

        if (!Array.isArray(body.messages) || !body.messages.every(isUiMessage)) {
          return new Response("Valid messages are required", { status: 400 });
        }

        if (typeof body.conversationId !== "string") {
          return new Response("conversationId is required", { status: 400 });
        }

        const token = (request.headers.get("Authorization") ?? "")
          .replace(/^Bearer\s+/i, "")
          .trim();

        if (!token) {
          return new Response("Unauthorized", { status: 401 });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !supabasePublishableKey) {
          return new Response("Server configuration error", { status: 500 });
        }

        const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          return new Response("Unauthorized", { status: 401 });
        }

        const userId = userData.user.id;

        const { data: conversation, error: conversationError } = await supabase
          .from("tutor_conversations")
          .select("id, language_code, level, title, mode")
          .eq("id", body.conversationId)
          .eq("user_id", userId)
          .maybeSingle();

        if (conversationError || !conversation) {
          return new Response("Conversation not found", { status: 404 });
        }

        const [{ data: language }, { data: profile }] = await Promise.all([
          supabase
            .from("languages")
            .select("name")
            .eq("code", conversation.language_code)
            .maybeSingle(),
          supabase.from("profiles").select("native_language_code").eq("id", userId).maybeSingle(),
        ]);

        let nativeLanguage = "English";

        if (profile?.native_language_code) {
          const { data: nativeLanguageRecord } = await supabase
            .from("languages")
            .select("name")
            .eq("code", profile.native_language_code)
            .maybeSingle();

          nativeLanguage = nativeLanguageRecord?.name ?? nativeLanguage;
        }

        const uiMessages = body.messages;
        const lastMessage = uiMessages.at(-1);
        const userText = lastMessage?.role === "user" ? uiMessageText(lastMessage) : "";

        if (!userText) {
          return new Response("A user message is required", { status: 400 });
        }

        const odynAiMessages = toOdynAiMessages(uiMessages);

        if (
          odynAiMessages.length === 0 ||
          odynAiMessages.some((message) => message.content.length > 8_000)
        ) {
          return new Response("Message content is invalid", { status: 400 });
        }

        const { error: userMessageError } = await supabase.from("tutor_messages").insert({
          conversation_id: conversation.id,
          user_id: userId,
          role: "user",
          content: userText,
        });

        if (userMessageError) {
          return new Response("Unable to save message", { status: 500 });
        }

        if (
          !(conversation.title ?? "").trim() ||
          conversation.title === "New conversation" ||
          conversation.title === "New lesson"
        ) {
          await supabase
            .from("tutor_conversations")
            .update({
              title: userText.slice(0, 60),
              updated_at: new Date().toISOString(),
            })
            .eq("id", conversation.id)
            .eq("user_id", userId);
        } else {
          await supabase
            .from("tutor_conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversation.id)
            .eq("user_id", userId);
        }

        const mode = conversation.mode === "teacher" ? "teacher" : "conversation";

        let result;

        try {
          result = await completeOdynAiLanguageChat({
            mode,
            targetLanguage: language?.name ?? conversation.language_code,
            nativeLanguage,
            level: conversation.level,
            messages: odynAiMessages,
            signal: request.signal,
          });
        } catch (error) {
          if (error instanceof OdynAiLanguageClientError) {
            console.error(`[OdynAI Language] ${error.message}`);
            return new Response(error.publicMessage, {
              status: error.statusCode,
            });
          }

          console.error(
            "[OdynAI Language] Unexpected chat failure",
            error instanceof Error ? error.name : "UnknownError",
          );

          return new Response("Language AI is temporarily unavailable.", {
            status: 502,
          });
        }

        const { error: assistantMessageError } = await supabase.from("tutor_messages").insert({
          conversation_id: conversation.id,
          user_id: userId,
          role: "assistant",
          content: result.content,
        });

        if (assistantMessageError) {
          console.error("[Tutor history] Assistant message persistence failed");
        }

        await supabase
          .from("tutor_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversation.id)
          .eq("user_id", userId);

        const stream = createUIMessageStream({
          originalMessages: uiMessages,
          execute: ({ writer }) => {
            const textId = crypto.randomUUID();

            writer.write({
              type: "text-start",
              id: textId,
            });

            writer.write({
              type: "text-delta",
              id: textId,
              delta: result.content,
            });

            writer.write({
              type: "text-end",
              id: textId,
            });
          },
          onError: () => "Language AI is temporarily unavailable.",
        });

        return createUIMessageStreamResponse({ stream });
      },
    },
  },
});
