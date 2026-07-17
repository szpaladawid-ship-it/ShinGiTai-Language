import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type TtsBody = {
  text?: unknown;
  voice?: unknown;
};

const ALLOWED_VOICES = new Set([
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
]);

const MAX_TEXT_LENGTH = 3000;

function getGatewayConfiguration() {
  const baseUrl =
    process.env.SHINGITAI_OPENAI_BASE_URL?.trim() ||
    "http://127.0.0.1:8000";

  const apiKey = process.env.SHINGITAI_OPENAI_API_KEY?.trim();

  const ttsPath =
    process.env.SHINGITAI_OPENAI_TTS_PATH?.trim() ||
    "/v1/audio/speech";

  const model =
    process.env.SHINGITAI_OPENAI_TTS_MODEL?.trim() ||
    "gpt-4o-mini-tts";

  if (!apiKey) {
    throw new Error("SHINGITAI_OPENAI_API_KEY is not configured");
  }

  return {
    url: new URL(ttsPath, `${baseUrl.replace(/\/+$/, "")}/`).toString(),
    apiKey,
    model,
  };
}

async function authenticateUser(request: Request) {
  const token = (request.headers.get("Authorization") ?? "")
    .replace(/^Bearer\s+/i, "")
    .trim();

  if (!token) return null;

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabasePublishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase server configuration is missing");
  }

  const supabase = createClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  return data.user;
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await authenticateUser(request);

          if (!user) {
            return new Response("Unauthorized", { status: 401 });
          }

          let body: TtsBody;

          try {
            body = (await request.json()) as TtsBody;
          } catch {
            return new Response("Invalid JSON body", { status: 400 });
          }

          const text =
            typeof body.text === "string" ? body.text.trim() : "";

          if (!text) {
            return new Response("text is required", { status: 400 });
          }

          const voice =
            typeof body.voice === "string" &&
            ALLOWED_VOICES.has(body.voice)
              ? body.voice
              : "alloy";

          const gateway = getGatewayConfiguration();

          const upstream = await fetch(gateway.url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${gateway.apiKey}`,
              "Content-Type": "application/json",
              "X-ShinGiTai-User-Id": user.id,
            },
            body: JSON.stringify({
              model: gateway.model,
              input: text.slice(0, MAX_TEXT_LENGTH),
              voice,
              response_format: "mp3",
            }),
            signal: AbortSignal.timeout(30_000),
          });

          if (!upstream.ok) {
            const detail = await upstream.text().catch(() => "");

            console.error("ShinGiTai Gateway TTS request failed", {
              status: upstream.status,
              detail,
            });

            if (upstream.status === 401 || upstream.status === 403) {
              return new Response("Gateway authentication failed", {
                status: 502,
              });
            }

            if (upstream.status === 429) {
              return new Response("Speech generation rate limit reached", {
                status: 429,
              });
            }

            return new Response(
              detail || "Speech generation is temporarily unavailable",
              {
                status:
                  upstream.status >= 400 && upstream.status < 600
                    ? upstream.status
                    : 502,
              },
            );
          }

          if (!upstream.body) {
            return new Response("Gateway returned an empty audio response", {
              status: 502,
            });
          }

          return new Response(upstream.body, {
            status: 200,
            headers: {
              "Content-Type":
                upstream.headers.get("Content-Type") || "audio/mpeg",
              "Cache-Control": "no-store",
            },
          });
        } catch (error) {
          if (error instanceof DOMException && error.name === "TimeoutError") {
            return new Response("Speech generation timed out", {
              status: 504,
            });
          }

          console.error("TTS route failed", error);

          return new Response(
            "Speech generation is temporarily unavailable",
            {
              status: 503,
            },
          );
        }
      },
    },
  },
});
