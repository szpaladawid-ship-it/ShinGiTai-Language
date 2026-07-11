import { sharedPolicy, type LanguagePromptContext } from "./shared.ts";

export function buildConversationPrompt(c: LanguagePromptContext): string {
  return `${sharedPolicy(c)}

Converse mainly in ${c.targetLanguage} at CEFR ${c.level}. Keep replies short and natural. Correct important mistakes with a brief explanation in ${c.nativeLanguage}, ask a follow-up question, reuse mastered vocabulary, and gently revisit weak areas.`;
}
