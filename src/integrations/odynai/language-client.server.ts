export type OdynAiLanguageMode = "conversation" | "teacher";

export type OdynAiLanguageMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CompleteOdynAiLanguageChatInput = {
  mode: OdynAiLanguageMode;
  targetLanguage: string;
  nativeLanguage: string;
  level: string;
  messages: OdynAiLanguageMessage[];
  signal?: AbortSignal;
};

export type OdynAiLanguageChatResult = {
  requestId: string;
  content: string;
  finishReason: "stop";
  qualityRetryUsed: boolean;
};

type OdynAiLanguageResponse = {
  request_id?: unknown;
  content?: unknown;
  finish_reason?: unknown;
  truncated?: unknown;
  quality_retry_used?: unknown;
};

export class OdynAiLanguageClientError extends Error {
  readonly statusCode: number;
  readonly publicMessage: string;

  constructor(statusCode: number, publicMessage: string, internalMessage: string) {
    super(internalMessage);
    this.name = "OdynAiLanguageClientError";
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
  }
}

function normalizedBaseUrl(): string {
  const configured = process.env.ODYNAI_BASE_URL?.trim() || "http://127.0.0.1:8000";
  return configured.replace(/\/+$/, "");
}

function configuredTimeoutMs(): number {
  const raw = process.env.ODYNAI_REQUEST_TIMEOUT_MS?.trim();
  const parsed = raw ? Number.parseInt(raw, 10) : 260_000;

  if (!Number.isFinite(parsed) || parsed < 1_000) {
    return 260_000;
  }

  return parsed;
}

function applicationKey(): string {
  const key = process.env.ODYNAI_LANGUAGE_APP_KEY?.trim();

  if (!key) {
    throw new OdynAiLanguageClientError(
      503,
      "Language AI is not configured.",
      "Missing ODYNAI_LANGUAGE_APP_KEY",
    );
  }

  return key;
}

function mapUpstreamStatus(statusCode: number): {
  statusCode: number;
  publicMessage: string;
} {
  if (statusCode === 429) {
    return {
      statusCode: 429,
      publicMessage: "Language AI request limit reached.",
    };
  }

  if (statusCode === 504) {
    return {
      statusCode: 504,
      publicMessage: "Language AI timed out.",
    };
  }

  if (statusCode === 401 || statusCode === 403 || statusCode === 503) {
    return {
      statusCode: 503,
      publicMessage: "Language AI is temporarily unavailable.",
    };
  }

  return {
    statusCode: 502,
    publicMessage: "Language AI returned an invalid response.",
  };
}

function parseResponse(payload: unknown): OdynAiLanguageChatResult {
  if (!payload || typeof payload !== "object") {
    throw new OdynAiLanguageClientError(
      502,
      "Language AI returned an invalid response.",
      "OdynAI response is not an object",
    );
  }

  const response = payload as OdynAiLanguageResponse;

  if (
    typeof response.request_id !== "string" ||
    typeof response.content !== "string" ||
    typeof response.finish_reason !== "string" ||
    typeof response.truncated !== "boolean" ||
    typeof response.quality_retry_used !== "boolean"
  ) {
    throw new OdynAiLanguageClientError(
      502,
      "Language AI returned an invalid response.",
      "OdynAI response does not match the Language contract",
    );
  }

  const content = response.content.trim();

  if (!content) {
    throw new OdynAiLanguageClientError(
      502,
      "Language AI returned an empty response.",
      "OdynAI returned empty Language content",
    );
  }

  if (response.finish_reason !== "stop" || response.truncated) {
    throw new OdynAiLanguageClientError(
      502,
      "Language AI could not complete the response.",
      `OdynAI returned finish_reason=${response.finish_reason}, truncated=${response.truncated}`,
    );
  }

  return {
    requestId: response.request_id,
    content,
    finishReason: "stop",
    qualityRetryUsed: response.quality_retry_used,
  };
}

export async function completeOdynAiLanguageChat(
  input: CompleteOdynAiLanguageChatInput,
): Promise<OdynAiLanguageChatResult> {
  const controller = new AbortController();
  const timeoutMs = configuredTimeoutMs();
  let timedOut = false;

  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const abortFromParent = () => controller.abort();

  if (input.signal?.aborted) {
    controller.abort();
  } else {
    input.signal?.addEventListener("abort", abortFromParent, { once: true });
  }

  try {
    const response = await fetch(`${normalizedBaseUrl()}/v1/gateways/language/chat`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-ShinGiTai-App-Key": applicationKey(),
      },
      body: JSON.stringify({
        mode: input.mode,
        target_language: input.targetLanguage,
        native_language: input.nativeLanguage,
        level: input.level,
        messages: input.messages,
        max_tokens: input.mode === "teacher" ? 512 : 384,
        temperature: input.mode === "teacher" ? 0.2 : 0.5,
      }),
      signal: controller.signal,
    });

    const rawBody = await response.text();
    let payload: unknown = null;

    if (rawBody) {
      try {
        payload = JSON.parse(rawBody) as unknown;
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const mapped = mapUpstreamStatus(response.status);

      throw new OdynAiLanguageClientError(
        mapped.statusCode,
        mapped.publicMessage,
        `OdynAI Language request failed with HTTP ${response.status}`,
      );
    }

    return parseResponse(payload);
  } catch (error) {
    if (error instanceof OdynAiLanguageClientError) {
      throw error;
    }

    if (controller.signal.aborted) {
      if (timedOut) {
        throw new OdynAiLanguageClientError(
          504,
          "Language AI timed out.",
          `OdynAI Language request exceeded ${timeoutMs} ms`,
        );
      }

      throw new OdynAiLanguageClientError(
        499,
        "Language AI request was cancelled.",
        "OdynAI Language request was cancelled",
      );
    }

    throw new OdynAiLanguageClientError(
      503,
      "Language AI is temporarily unavailable.",
      error instanceof Error ? error.message : "Unknown OdynAI connection failure",
    );
  } finally {
    clearTimeout(timeout);
    input.signal?.removeEventListener("abort", abortFromParent);
  }
}
