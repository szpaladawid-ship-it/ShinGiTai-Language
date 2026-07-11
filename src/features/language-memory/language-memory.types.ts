export const MEMORY_TYPES = [
  "vocabulary_known",
  "vocabulary_learning",
  "grammar_strength",
  "grammar_weakness",
  "repeated_mistake",
  "pronunciation_issue",
  "completed_topic",
  "learning_goal",
  "teacher_preference",
  "conversation_topic",
  "review_due",
] as const;

export type LearningMemoryType = (typeof MEMORY_TYPES)[number];
export type LearningMemoryValue = Record<string, string | number | boolean | string[]>;

export type LearningOutcomeCandidate = {
  userId: string;
  targetLanguageCode: string;
  memoryType: LearningMemoryType;
  key: string;
  value: LearningMemoryValue;
  confidence: number;
  source: "verified_teacher" | "verified_exercise" | "verified_review";
};

export type LearnerProfile = {
  user_id: string;
  target_language_code: string;
  native_language_code: string | null;
  current_level: string;
  learning_goal: string | null;
  preferred_style: string | null;
  correction_intensity: string | null;
  conversation_preference: string | null;
  daily_goal_minutes: number | null;
};

export type LearningMemory = {
  id: string;
  memory_type: LearningMemoryType;
  key: string;
  value_json: LearningMemoryValue;
  confidence: number;
  source: string;
  updated_at: string;
};
