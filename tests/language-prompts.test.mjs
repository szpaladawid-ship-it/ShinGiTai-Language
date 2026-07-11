import test from "node:test";
import assert from "node:assert/strict";
import { buildTeacherPrompt } from "../src/integrations/shingitai-openai/prompts/teacher.ts";
import { buildConversationPrompt } from "../src/integrations/shingitai-openai/prompts/conversation.ts";

const context = { targetLanguage: "Norwegian", nativeLanguage: "Polish", level: "A2" };
test("teacher prompt contains language, native language and level", () => {
  const prompt = buildTeacherPrompt(context);
  assert.match(prompt, /Norwegian/);
  assert.match(prompt, /Polish/);
  assert.match(prompt, /A2/);
});
test("conversation prompt remains language-learning scoped", () => {
  const prompt = buildConversationPrompt(context);
  assert.match(prompt, /general AI assistant/);
  assert.match(prompt, /Norwegian/);
  assert.match(prompt, /A2/);
});
