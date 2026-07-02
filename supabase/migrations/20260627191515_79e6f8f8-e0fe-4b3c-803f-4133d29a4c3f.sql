-- 1. Teacher mode for AI conversations
ALTER TABLE public.tutor_conversations
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'conversation';

ALTER TABLE public.tutor_conversations
  ADD CONSTRAINT tutor_conversations_mode_check CHECK (mode IN ('conversation', 'teacher'));

-- 2. Exam sessions (one row per exam taken)
CREATE TABLE public.exam_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  level public.cefr_level NOT NULL,
  status text NOT NULL DEFAULT 'in_progress',
  total_questions integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  score_percent integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  pass_threshold integer NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_sessions TO authenticated;
GRANT ALL ON public.exam_sessions TO service_role;

ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own exam sessions"
  ON public.exam_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_exam_sessions_updated_at
  BEFORE UPDATE ON public.exam_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Exam questions (correct_index hidden from learners via column grants)
CREATE TABLE public.exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  section text NOT NULL DEFAULT 'grammar',
  prompt text NOT NULL,
  options jsonb NOT NULL,
  correct_index integer NOT NULL,
  user_answer integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Column-level grants: learners can read everything EXCEPT correct_index
GRANT SELECT (id, session_id, order_index, section, prompt, options, user_answer) ON public.exam_questions TO authenticated;
GRANT ALL ON public.exam_questions TO service_role;

ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

-- Only read access for learners; all writes happen server-side via service role
CREATE POLICY "Users read their own exam questions"
  ON public.exam_questions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.exam_sessions s
    WHERE s.id = exam_questions.session_id AND s.user_id = auth.uid()
  ));

CREATE INDEX idx_exam_questions_session ON public.exam_questions (session_id, order_index);
CREATE INDEX idx_exam_sessions_user ON public.exam_sessions (user_id, created_at DESC);