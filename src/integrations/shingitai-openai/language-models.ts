export const LANGUAGE_MODEL_ALIAS = "shingitai-language" as const;

export function getLanguageModel(): string {
  const configured = process.env.SHINGITAI_OPENAI_LANGUAGE_MODEL?.trim();
  if (configured && configured !== LANGUAGE_MODEL_ALIAS) {
    throw new Error("Only the official ShinGiTai Language model alias is allowed");
  }
  return LANGUAGE_MODEL_ALIAS;
}
