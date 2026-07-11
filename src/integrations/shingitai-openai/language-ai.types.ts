export type LanguageMode = "teacher" | "conversation";

export type LanguageAiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LanguageAiRequest = {
  mode: LanguageMode;
  targetLanguageCode: string;
  messages: LanguageAiMessage[];
  signal?: AbortSignal;
};

export type LanguageAiResponse = { text: string };
