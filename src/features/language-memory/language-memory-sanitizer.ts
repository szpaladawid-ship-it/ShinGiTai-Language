const UNSAFE_KEYS = new Set([
  "instruction",
  "instructions",
  "prompt",
  "system",
  "assistant",
  "user",
  "transcript",
]);

export function sanitizeMemoryValue(
  value: Record<string, unknown>,
): Record<string, string | number | boolean | string[]> {
  const output: Record<string, string | number | boolean | string[]> = {};
  for (const [key, item] of Object.entries(value)) {
    if (UNSAFE_KEYS.has(key.toLowerCase())) continue;
    if (typeof item === "string") output[key] = item.replace(/[<>]/g, "").slice(0, 300);
    else if (typeof item === "number" || typeof item === "boolean") output[key] = item;
    else if (Array.isArray(item))
      output[key] = item
        .filter((v): v is string => typeof v === "string")
        .slice(0, 20)
        .map((v) => v.replace(/[<>]/g, "").slice(0, 100));
  }
  return output;
}
