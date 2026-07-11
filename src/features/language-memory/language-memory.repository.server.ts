import type {
  LearnerProfile,
  LearningMemory,
  LearningMemoryType,
  LearningMemoryValue,
} from "./language-memory.types.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../integrations/supabase/types.ts";

type SupabaseLike = SupabaseClient<Database>;

export async function readLearnerProfile(
  db: SupabaseLike,
  userId: string,
  targetLanguageCode: string,
): Promise<LearnerProfile | null> {
  const { data, error } = await db
    .from("language_learner_profiles")
    .select(
      "user_id,target_language_code,native_language_code,current_level,learning_goal,preferred_style,correction_intensity,conversation_preference,daily_goal_minutes",
    )
    .eq("user_id", userId)
    .eq("target_language_code", targetLanguageCode)
    .maybeSingle();
  if (error) throw error;
  return data as LearnerProfile | null;
}

export async function readRelevantMemories(
  db: SupabaseLike,
  userId: string,
  targetLanguageCode: string,
  limit: number,
): Promise<LearningMemory[]> {
  const { data, error } = await db
    .from("language_learning_memories")
    .select("id,memory_type,key,value_json,confidence,source,updated_at")
    .eq("user_id", userId)
    .eq("target_language_code", targetLanguageCode)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(Math.min(10, Math.max(1, limit)));
  if (error) throw error;
  return (data ?? []) as LearningMemory[];
}

export async function writeLearningMemory(
  db: SupabaseLike,
  input: {
    userId: string;
    targetLanguageCode: string;
    memoryType: LearningMemoryType;
    key: string;
    value: LearningMemoryValue;
    confidence: number;
    source: string;
  },
) {
  const { error } = await db.from("language_learning_memories").upsert(
    {
      user_id: input.userId,
      target_language_code: input.targetLanguageCode,
      memory_type: input.memoryType,
      key: input.key,
      value_json: input.value,
      confidence: input.confidence,
      source: input.source,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,target_language_code,memory_type,key" },
  );
  if (error) throw error;
}

export async function deactivateLearningMemory(
  db: SupabaseLike,
  userId: string,
  targetLanguageCode: string,
) {
  const { error } = await db
    .from("language_learning_memories")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("target_language_code", targetLanguageCode);
  if (error) throw error;
}
