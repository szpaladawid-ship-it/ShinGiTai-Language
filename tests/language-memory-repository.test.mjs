import test from "node:test";
import assert from "node:assert/strict";
import {
  deactivateLearningMemory,
  readRelevantMemories,
} from "../src/features/language-memory/language-memory.repository.server.ts";

function queryMock(data = []) {
  const calls = [];
  const query = {
    select() {
      return query;
    },
    eq(column, value) {
      calls.push(["eq", column, value]);
      return query;
    },
    order() {
      return query;
    },
    limit(value) {
      calls.push(["limit", value]);
      return Promise.resolve({ data, error: null });
    },
    update(value) {
      calls.push(["update", value]);
      return query;
    },
    then(resolve) {
      return Promise.resolve({ data, error: null }).then(resolve);
    },
  };
  return { db: { from: () => query }, calls };
}

test("memory reads are isolated by user", async () => {
  const mock = queryMock();
  await readRelevantMemories(mock.db, "user-a", "en", 10);
  assert.ok(mock.calls.some((call) => call[1] === "user_id" && call[2] === "user-a"));
});

test("memory reads are isolated by target language", async () => {
  const mock = queryMock();
  await readRelevantMemories(mock.db, "user-a", "ja", 10);
  assert.ok(mock.calls.some((call) => call[1] === "target_language_code" && call[2] === "ja"));
});

test("repository caps memory reads at ten", async () => {
  const mock = queryMock();
  await readRelevantMemories(mock.db, "user-a", "en", 999);
  assert.ok(mock.calls.some((call) => call[0] === "limit" && call[1] === 10));
});

test("clear memory scopes deactivation to user and language", async () => {
  const mock = queryMock();
  await deactivateLearningMemory(mock.db, "user-b", "pl");
  assert.ok(mock.calls.some((call) => call[1] === "user_id" && call[2] === "user-b"));
  assert.ok(mock.calls.some((call) => call[1] === "target_language_code" && call[2] === "pl"));
});
