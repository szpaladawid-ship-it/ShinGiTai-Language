import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("chat ignores client model and system prompt fields", async () => {
  const source = await read("../src/routes/api/chat.ts");
  assert.doesNotMatch(source, /body\.model|body\.system|body\.core_projects/);
  assert.match(source, /buildLanguageSystemPrompt/);
});

test("chat userId comes from authenticated Supabase user", async () => {
  const source = await read("../src/routes/api/chat.ts");
  assert.match(source, /userData\.user\.id/);
  assert.doesNotMatch(source, /body\.userId/);
});

test("conversation ownership is constrained by user_id", async () => {
  const source = await read("../src/routes/api/chat.ts");
  assert.match(source, /\.eq\("user_id", userId\)/);
});

test("chat, flashcards and exams use the shared boundary", async () => {
  for (const path of [
    "../src/routes/api/chat.ts",
    "../src/lib/flashcards.functions.ts",
    "../src/lib/exam.server.ts",
  ]) {
    assert.match(await read(path), /integrations\/shingitai-openai/);
  }
});

test("chat, flashcards and exams contain no direct provider fetch", async () => {
  for (const path of [
    "../src/routes/api/chat.ts",
    "../src/lib/flashcards.functions.ts",
    "../src/lib/exam.server.ts",
  ]) {
    const source = await read(path);
    assert.doesNotMatch(
      source,
      /fetch\s*\(|chat\/completions|api\.openai\.com|ai\.gateway\.lovable/,
    );
  }
});

test("memory read failure is caught before AI execution", async () => {
  const source = await read("../src/routes/api/chat.ts");
  assert.match(source, /catch \(error\)[\s\S]*\[Language memory\] Read failed/);
  assert.match(source, /completeLanguageAi/);
});

test("assistant-memory persistence cannot block the streamed response", async () => {
  const source = await read("../src/routes/api/chat.ts");
  assert.doesNotMatch(source, /recordLearningOutcome|upsertLearningMemory/);
});
