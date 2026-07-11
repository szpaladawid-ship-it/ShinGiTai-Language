import { MemoryReadError, MemoryWriteError } from "../../integrations/shingitai-openai/errors.ts";
import { buildLearningMemoryContext } from "./language-memory-context.ts";
import { assertSafeMemory } from "./language-memory.policy.ts";
import {
  deactivateLearningMemory,
  readLearnerProfile,
  readRelevantMemories,
  writeLearningMemory,
} from "./language-memory.repository.server.ts";
import { sanitizeMemoryValue } from "./language-memory-sanitizer.ts";
import type { LearningMemoryType } from "./language-memory.types.ts";
import type { LearningOutcomeCandidate } from "./language-memory.types.ts";
import { validateLearningOutcomeCandidate } from "./language-memory-extractor.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../integrations/supabase/types.ts";

type Db = SupabaseClient<Database>;

export async function getLearnerProfile({
  db,
  userId,
  targetLanguageCode,
}: {
  db: Db;
  userId: string;
  targetLanguageCode: string;
}) {
  try {
    return await readLearnerProfile(db, userId, targetLanguageCode);
  } catch {
    throw new MemoryReadError("Unable to read learner profile");
  }
}
export async function getRelevantMemories({
  db,
  userId,
  targetLanguageCode,
  limit = 10,
}: {
  db: Db;
  userId: string;
  targetLanguageCode: string;
  mode?: string;
  limit?: number;
}) {
  try {
    return await readRelevantMemories(db, userId, targetLanguageCode, limit);
  } catch {
    throw new MemoryReadError("Unable to read learning memory");
  }
}
export { buildLearningMemoryContext };
export async function upsertLearningMemory({
  db,
  userId,
  targetLanguageCode,
  memoryType,
  key,
  value,
  confidence = 0.7,
  source = "language_ai",
}: {
  db: Db;
  userId: string;
  targetLanguageCode: string;
  memoryType: LearningMemoryType;
  key: string;
  value: Record<string, unknown>;
  confidence?: number;
  source?: string;
}) {
  try {
    const clean = sanitizeMemoryValue(value);
    assertSafeMemory(memoryType, clean);
    await writeLearningMemory(db, {
      userId,
      targetLanguageCode,
      memoryType,
      key: key.slice(0, 120),
      value: clean,
      confidence: Math.min(1, Math.max(0, confidence)),
      source: source.slice(0, 60),
    });
  } catch {
    throw new MemoryWriteError("Unable to write learning memory");
  }
}
export async function recordLearningOutcome(
  input: Parameters<typeof upsertLearningMemory>[0] & { outcome?: unknown },
) {
  return upsertLearningMemory(input);
}

export async function recordVerifiedLearningOutcomes({
  db,
  authenticatedUserId,
  profileLanguageCode,
  candidates,
}: {
  db: Db;
  authenticatedUserId: string;
  profileLanguageCode: string;
  candidates: unknown[];
}) {
  for (const raw of candidates) {
    const candidate: LearningOutcomeCandidate = validateLearningOutcomeCandidate(raw);
    if (candidate.userId !== authenticatedUserId)
      throw new MemoryWriteError("Learning outcome user mismatch");
    if (candidate.targetLanguageCode !== profileLanguageCode)
      throw new MemoryWriteError("Learning outcome language mismatch");
    await upsertLearningMemory({
      db,
      userId: authenticatedUserId,
      targetLanguageCode: profileLanguageCode,
      memoryType: candidate.memoryType,
      key: candidate.key,
      value: candidate.value,
      confidence: candidate.confidence,
      source: candidate.source,
    });
  }
}
export async function clearLearningMemory({
  db,
  userId,
  targetLanguageCode,
}: {
  db: Db;
  userId: string;
  targetLanguageCode: string;
}) {
  try {
    await deactivateLearningMemory(db, userId, targetLanguageCode);
  } catch {
    throw new MemoryWriteError("Unable to clear learning memory");
  }
}
