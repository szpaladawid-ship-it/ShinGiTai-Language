CREATE TABLE public.language_learner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_language_code text NOT NULL REFERENCES public.languages(code),
  native_language_code text REFERENCES public.languages(code),
  current_level public.cefr_level NOT NULL DEFAULT 'A1',
  learning_goal text CHECK (learning_goal IS NULL OR char_length(learning_goal) <= 500),
  preferred_style text CHECK (preferred_style IS NULL OR char_length(preferred_style) <= 120),
  correction_intensity text CHECK (correction_intensity IN ('gentle', 'balanced', 'intensive')),
  conversation_preference text CHECK (conversation_preference IS NULL OR char_length(conversation_preference) <= 120),
  daily_goal_minutes integer CHECK (daily_goal_minutes BETWEEN 1 AND 1440),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_language_code)
);

CREATE TABLE public.language_learning_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_language_code text NOT NULL REFERENCES public.languages(code),
  memory_type text NOT NULL CHECK (memory_type IN ('vocabulary_known','vocabulary_learning','grammar_strength','grammar_weakness','repeated_mistake','pronunciation_issue','completed_topic','learning_goal','teacher_preference','conversation_topic','review_due')),
  key text NOT NULL CHECK (char_length(key) BETWEEN 1 AND 120),
  value_json jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(value_json) = 'object' AND octet_length(value_json::text) <= 5000),
  confidence numeric(4,3) NOT NULL DEFAULT 0.700 CHECK (confidence BETWEEN 0 AND 1),
  source text NOT NULL DEFAULT 'language_ai' CHECK (char_length(source) <= 60),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  UNIQUE (user_id, target_language_code, memory_type, key)
);

ALTER TABLE public.language_learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_learning_memories ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.language_learner_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.language_learning_memories TO authenticated;
GRANT ALL ON public.language_learner_profiles TO service_role;
GRANT ALL ON public.language_learning_memories TO service_role;
CREATE POLICY "Users manage own learner profiles" ON public.language_learner_profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own learning memories" ON public.language_learning_memories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_language_learner_profiles_user_language ON public.language_learner_profiles(user_id, target_language_code);
CREATE INDEX idx_language_learning_memories_active ON public.language_learning_memories(user_id, target_language_code, is_active, updated_at DESC);
CREATE TRIGGER trg_language_learner_profiles_updated BEFORE UPDATE ON public.language_learner_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_language_learning_memories_updated BEFORE UPDATE ON public.language_learning_memories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
