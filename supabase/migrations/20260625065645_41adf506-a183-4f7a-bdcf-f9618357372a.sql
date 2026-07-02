DROP POLICY IF EXISTS "Admins manage grammar lessons" ON public.grammar_lessons;
DROP POLICY IF EXISTS "Admins manage quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins manage quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Admins manage languages" ON public.languages;

CREATE POLICY "Admins manage grammar lessons" ON public.grammar_lessons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage quizzes" ON public.quizzes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage quiz questions" ON public.quiz_questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage languages" ON public.languages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));