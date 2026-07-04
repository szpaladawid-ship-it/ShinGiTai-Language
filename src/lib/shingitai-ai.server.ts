import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export type ShinGiTaiAiProvider = "openai" | "openrouter" | "ollama" | "custom";

export function getShinGiTaiAiConfig() {
  const provider = (process.env.SHINGITAI_AI_PROVIDER ?? "custom") as ShinGiTaiAiProvider;
  const baseURL = process.env.SHINGITAI_AI_BASE_URL;
  const apiKey = process.env.SHINGITAI_AI_API_KEY;
  const model = process.env.SHINGITAI_AI_MODEL ?? "gpt-4o-mini";

  if (!baseURL) {
    throw new Error("Missing SHINGITAI_AI_BASE_URL");
  }

  if (provider !== "ollama" && !apiKey) {
    throw new Error("Missing SHINGITAI_AI_API_KEY");
  }

  return { provider, baseURL, apiKey, model };
}

export function createShinGiTaiAiProvider() {
  const { provider, baseURL, apiKey } = getShinGiTaiAiConfig();

  return createOpenAICompatible({
    name: `shingitai-${provider}`,
    baseURL,
    headers: apiKey
      ? {
          Authorization: `Bearer ${apiKey}`,
        }
      : undefined,
  });
}

export function getShinGiTaiAiModel() {
  return getShinGiTaiAiConfig().model;
}
