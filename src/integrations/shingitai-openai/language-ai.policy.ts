import { LANGUAGE_MODEL_ALIAS } from "./language-models.ts";
import { resolveLanguageCoreProject } from "./language-core-projects.ts";
import type { LanguageAiMessage } from "./language-ai.types.ts";

export function buildGatewayRequest(targetLanguageCode: string, messages: LanguageAiMessage[]) {
  return {
    model: LANGUAGE_MODEL_ALIAS,
    messages,
    stream: false,
    use_core_context: true,
    core_projects: [resolveLanguageCoreProject(targetLanguageCode)],
    core_context_limit: 5,
    core_context_max_chars: 5000,
  };
}
