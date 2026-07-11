import {
  MEMORY_TYPES,
  type LearningMemoryType,
  type LearningMemoryValue,
} from "./language-memory.types.ts";

const SECRET_PATTERN =
  /(?:sgt_|sk-|api[_ -]?key|service[_ -]?role|password|bearer\s+[a-z0-9._-]+)/i;

export function isLearningMemoryType(value: string): value is LearningMemoryType {
  return (MEMORY_TYPES as readonly string[]).includes(value);
}

export function assertSafeMemory(
  type: string,
  value: LearningMemoryValue,
): asserts type is LearningMemoryType {
  if (!isLearningMemoryType(type)) throw new Error("Memory type is not allowed");
  const serialized = JSON.stringify(value);
  if (serialized.length > 1200) throw new Error("Memory value is too large");
  if (SECRET_PATTERN.test(serialized)) throw new Error("Memory contains prohibited sensitive data");
}
