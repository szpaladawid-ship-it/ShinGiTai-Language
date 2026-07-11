import test from "node:test";
import assert from "node:assert/strict";
import { validateLearningOutcomeCandidate } from "../src/features/language-memory/language-memory-extractor.ts";
import { recordVerifiedLearningOutcomes } from "../src/features/language-memory/language-memory.service.server.ts";

const valid = {
  userId: "user-a",
  targetLanguageCode: "nb",
  memoryType: "vocabulary_known",
  key: "numbers",
  value: { masteredCount: 10 },
  confidence: 0.9,
  source: "verified_exercise",
};

function writeDb(error = null) {
  const writes = [];
  return {
    writes,
    db: {
      from() {
        return {
          upsert(value) {
            writes.push(value);
            return Promise.resolve({ error });
          },
        };
      },
    },
  };
}

test("valid verified outcome is accepted", async () => {
  const mock = writeDb();
  await recordVerifiedLearningOutcomes({
    db: mock.db,
    authenticatedUserId: "user-a",
    profileLanguageCode: "nb",
    candidates: [valid],
  });
  assert.equal(mock.writes.length, 1);
});

test("invalid memory type is rejected", () => {
  assert.throws(() => validateLearningOutcomeCandidate({ ...valid, memoryType: "general_chat" }));
});

test("secret-like outcome is rejected", () => {
  assert.throws(() =>
    validateLearningOutcomeCandidate({ ...valid, value: { note: "sk-example-secret" } }),
  );
});

test("oversized outcome payload is rejected", () => {
  assert.throws(() =>
    validateLearningOutcomeCandidate({ ...valid, value: { note: "x".repeat(1300) } }),
  );
});

test("outcome cannot target another user", async () => {
  await assert.rejects(
    recordVerifiedLearningOutcomes({
      db: writeDb().db,
      authenticatedUserId: "user-b",
      profileLanguageCode: "nb",
      candidates: [valid],
    }),
    /user mismatch/,
  );
});

test("outcome cannot mix another profile language", async () => {
  await assert.rejects(
    recordVerifiedLearningOutcomes({
      db: writeDb().db,
      authenticatedUserId: "user-a",
      profileLanguageCode: "pl",
      candidates: [valid],
    }),
    /language mismatch/,
  );
});

test("write failure is normalized without leaking database details", async () => {
  await assert.rejects(
    recordVerifiedLearningOutcomes({
      db: writeDb(new Error("private database detail")).db,
      authenticatedUserId: "user-a",
      profileLanguageCode: "nb",
      candidates: [valid],
    }),
    (error) => error.constructor.name === "MemoryWriteError" && !error.message.includes("private"),
  );
});
