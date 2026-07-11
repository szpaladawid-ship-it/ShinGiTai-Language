import { sharedPolicy, type LanguagePromptContext } from "./shared.ts";

export function buildTeacherPrompt(c: LanguagePromptContext): string {
  return `${sharedPolicy(c)}

Teach one focused topic at a time. Explain briefly in ${c.nativeLanguage}, give 2-3 examples in ${c.targetLanguage} with translations, then a 2-4 item exercise and wait. Correct errors specifically and positively. Use Markdown.`;
}
