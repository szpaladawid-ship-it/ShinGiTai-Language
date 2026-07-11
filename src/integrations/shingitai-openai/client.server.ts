import {
  AuthenticationError,
  RateLimitError,
  TimeoutError,
  createShinGiTaiClient,
} from "@shingitai/openai-sdk";
import {
  ShinGiTaiAuthenticationError,
  ShinGiTaiConfigurationError,
  ShinGiTaiRateLimitError,
  ShinGiTaiTimeoutError,
  ShinGiTaiUnavailableError,
} from "./errors.ts";

export function createLanguageGatewayClient() {
  const baseUrl = process.env.SHINGITAI_OPENAI_BASE_URL?.trim() || "http://127.0.0.1:8000";
  const apiKey = process.env.SHINGITAI_OPENAI_API_KEY?.trim();
  if (!apiKey) throw new ShinGiTaiConfigurationError("ShinGiTai OpenAi is not configured");

  return createShinGiTaiClient({ baseUrl, apiKey, timeoutMs: 30_000, retry: { maxAttempts: 1 } });
}

export function mapGatewayError(error: unknown): Error {
  if (error instanceof AuthenticationError)
    return new ShinGiTaiAuthenticationError("Gateway authentication failed");
  if (error instanceof RateLimitError)
    return new ShinGiTaiRateLimitError("Gateway rate limit reached");
  if (error instanceof TimeoutError) return new ShinGiTaiTimeoutError("Gateway request timed out");
  return new ShinGiTaiUnavailableError("Language AI is temporarily unavailable");
}
