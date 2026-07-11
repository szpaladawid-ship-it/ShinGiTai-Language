import { assertSafeMemory } from "./language-memory.policy.ts";
import type { LearningOutcomeCandidate } from "./language-memory.types.ts";

export function validateLearningOutcomeCandidate(value: unknown): LearningOutcomeCandidate {
  if (!value || typeof value !== "object") throw new Error("Invalid learning outcome");
  const candidate = value as Partial<LearningOutcomeCandidate>;
  if (!candidate.userId || !candidate.targetLanguageCode || !candidate.key)
    throw new Error("Learning outcome identity is required");
  if (!candidate.value || typeof candidate.value !== "object" || Array.isArray(candidate.value))
    throw new Error("Learning outcome value must be structured");
  if (
    typeof candidate.confidence !== "number" ||
    candidate.confidence < 0 ||
    candidate.confidence > 1
  )
    throw new Error("Invalid learning outcome confidence");
  if (
    !["verified_teacher", "verified_exercise", "verified_review"].includes(candidate.source ?? "")
  )
    throw new Error("Learning outcome source is not verified");
  assertSafeMemory(candidate.memoryType ?? "", candidate.value);
  if (candidate.key.length > 120) throw new Error("Learning outcome key is too long");
  return candidate as LearningOutcomeCandidate;
}

// Automatic extraction remains disabled until a verified extractor is implemented.
export function extractLearningOutcomes(): [] {
  return [];
}
