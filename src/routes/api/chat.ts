import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

type ChatRequestBody = {
  messages?: unknown;
  conversationId?: unknown;
};

function uiMessageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const conversationId = body.conversationId;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        if (typeof conversationId !== "string") {
          return new Response("conversationId is required", { status: 400 });
        }

        const authHeader = request.headers.get("Authorization") ?? "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        if (!token) {
          return new Response("Unauthorized", { status: 401 });
        }

        const supabase = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { headers: { Authorization: `Bearer ${token}` } },
          },
        );

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = userData.user.id;

        // Load the conversation (RLS ensures it belongs to this user)
        const { data: conversation, error: convError } = await supabase
          .from("tutor_conversations")
          .select("id, language_code, level, title, mode")
          .eq("id", conversationId)
          .maybeSingle();
        if (convError || !conversation) {
          return new Response("Conversation not found", { status: 404 });
        }

        const { data: language } = await supabase
          .from("languages")
          .select("name")
          .eq("code", conversation.language_code)
          .maybeSingle();
        const languageName = language?.name ?? conversation.language_code;
        const level = conversation.level;

        // Resolve the learner's native language so the tutor explains in it.
        const { data: profile } = await supabase
          .from("profiles")
          .select("native_language_code")
          .eq("id", userId)
          .maybeSingle();
        let nativeName = "English";
        if (profile?.native_language_code) {
          const { data: nativeLang } = await supabase
            .from("languages")
            .select("name")
            .eq("code", profile.native_language_code)
            .maybeSingle();
          nativeName = nativeLang?.name ?? nativeName;
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const uiMessages = messages as UIMessage[];
        const lastMessage = uiMessages[uiMessages.length - 1];

        // Persist the latest user message before streaming.
        if (lastMessage && lastMessage.role === "user") {
          const text = uiMessageText(lastMessage);
          if (text) {
            await supabase.from("tutor_messages").insert({
              conversation_id: conversationId,
              user_id: userId,
              role: "user",
              content: text,
            });
            // Auto-title the conversation from the first message.
            if ((conversation.title ?? "").trim() === "" || conversation.title === "New conversation") {
              await supabase
                .from("tutor_conversations")
                .update({ title: text.slice(0, 60) })
                .eq("id", conversationId);
            } else {
              await supabase
                .from("tutor_conversations")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", conversationId);
            }
          }
        }

        const conversationSystem = `You are an expert, encouraging language tutor on LinguaVerse AI.
You are helping the learner practice ${languageName} at CEFR level ${level}.
The learner's native language is ${nativeName}.

Guidelines:
- Conduct the conversation primarily in ${languageName}, adapting vocabulary and grammar to a ${level} learner.
- Keep replies short and natural so the learner can respond. Ask a follow-up question to keep the conversation going.
- When the learner makes a mistake, gently correct it: show the corrected version and a one-line explanation, then continue the conversation.
- ALL explanations, translations, corrections and help MUST be written in ${nativeName} (the learner's native language) — never in English unless ${nativeName} is English.
- If the learner writes in ${nativeName} or asks for help, briefly explain in ${nativeName}, then steer back to ${languageName}.
- Be warm, patient, and motivating. Use occasional emoji sparingly.
- Format responses with Markdown when it helps (bold key words, short lists for corrections).`;

        const teacherSystem = `You are a structured, professional language teacher on LinguaVerse AI — like a teacher in a real classroom.
You are teaching ${languageName} to a student at CEFR level ${level}.
The student's native language is ${nativeName}.

Follow a clear teaching method:
- Teach ONE focused topic at a time (a grammar point, a vocabulary set, or a sentence pattern). Don't overload the student.
- Write ALL explanations, rules, instructions and translations in ${nativeName} (the student's native language) — never in English unless ${nativeName} is English. Only the ${languageName} examples themselves stay in ${languageName}.
- First explain the rule clearly and simply in ${nativeName}. Then give 2-3 example sentences in ${languageName}, each with its ${nativeName} translation.
- After explaining, give a SHORT exercise (2-4 questions) for the student to practice, and wait for their answers before continuing.
- When the student answers, mark each item correct or incorrect, give the correct answer with a brief explanation in ${nativeName}, and praise their progress.
- Keep a logical curriculum order suitable for ${level}, building on what was already taught in this lesson.
- Be patient, organized, and motivating, like a great school teacher.
- Use Markdown structure (headings, **bold**, numbered lists) so each lesson is easy to follow.`;

        const system = conversation.mode === "teacher" ? teacherSystem : conversationSystem;


        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(uiMessages),
          onFinish: async ({ text }) => {
            const clean = text.trim();
            if (clean) {
              await supabase.from("tutor_messages").insert({
                conversation_id: conversationId,
                user_id: userId,
                role: "assistant",
                content: clean,
              });
              await supabase
                .from("tutor_conversations")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", conversationId);
            }
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, gateway);
      },
    },
  },
});
