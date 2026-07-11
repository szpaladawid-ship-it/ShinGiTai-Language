import { buildConversationPrompt } from "./prompts/conversation";
import { buildTeacherPrompt } from "./prompts/teacher";
import type { LanguagePromptContext } from "./prompts/shared";
import type { LanguageMode } from "./language-ai.types";

export function buildLanguageSystemPrompt(
  mode: LanguageMode,
  context: LanguagePromptContext,
): string {
  return mode === "teacher" ? buildTeacherPrompt(context) : buildConversationPrompt(context);
}
