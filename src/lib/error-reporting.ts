type AppErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type AppErrorPayload = {
  error: unknown;
  context: Record<string, unknown>;
  options: AppErrorOptions;
  timestamp: string;
};

function normalizeError(error: unknown): unknown {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
}

export function reportAppError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: AppErrorOptions = {},
) {
  const payload: AppErrorPayload = {
    error: normalizeError(error),
    context: {
      app: "shingitai-language",
      route: typeof window !== "undefined" ? window.location.pathname : undefined,
      ...context,
    },
    options: {
      mechanism: "manual",
      handled: false,
      severity: "error",
      ...options,
    },
    timestamp: new Date().toISOString(),
  };

  // Local reporting for now. Later this can forward to ShinGiTai Analytics,
  // Sentry, PostHog, OpenTelemetry, or a custom monitoring backend.
  if (payload.options.severity === "warning") {
    console.warn("[ShinGiTai Language]", payload);
    return;
  }

  if (payload.options.severity === "info") {
    console.info("[ShinGiTai Language]", payload);
    return;
  }

  console.error("[ShinGiTai Language]", payload);
}
