-- ============ Gamification: Achievements ============
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'award',
  category text NOT NULL DEFAULT 'general',
  threshold integer NOT NULL DEFAULT 0,
  xp_reward integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins manage achievements" ON public.achievements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
GRANT SELECT, INSERT ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own achievements" ON public.user_achievements FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users earn own achievements" ON public.user_achievements FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============ Premium: Subscribers ============
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own subscription" ON public.subscribers FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins view all subscriptions" ON public.subscribers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Leaderboard (security definer, limited columns) ============
CREATE OR REPLACE FUNCTION public.get_leaderboard(_limit integer DEFAULT 50)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_url text,
  total_xp integer,
  current_streak integer,
  longest_streak integer
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.user_id, p.display_name, p.avatar_url, s.total_xp, s.current_streak, s.longest_streak
  FROM public.user_stats s
  JOIN public.profiles p ON p.id = s.user_id
  ORDER BY s.total_xp DESC, s.current_streak DESC
  LIMIT GREATEST(1, LEAST(_limit, 100))
$$;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(integer) TO anon, authenticated;

-- ============ Admin bootstrap: claim admin if none exists ============
CREATE OR REPLACE FUNCTION public.claim_first_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  admin_exists boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO admin_exists;
  IF admin_exists THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin(uuid) TO authenticated;

-- ============ Admin overview stats (security definer) ============
CREATE OR REPLACE FUNCTION public.get_admin_overview()
RETURNS json
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  result json;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'total_courses', (SELECT count(*) FROM public.user_courses),
    'total_lessons', (SELECT count(*) FROM public.grammar_lessons),
    'total_quizzes', (SELECT count(*) FROM public.quizzes),
    'pro_subscribers', (SELECT count(*) FROM public.subscribers WHERE tier = 'pro' AND status = 'active'),
    'total_xp_awarded', (SELECT COALESCE(sum(total_xp), 0) FROM public.user_stats)
  ) INTO result;
  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_admin_overview() TO authenticated;

-- ============ Admin user list (security definer) ============
CREATE OR REPLACE FUNCTION public.get_admin_users(_limit integer DEFAULT 100)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  username text,
  avatar_url text,
  created_at timestamptz,
  total_xp integer,
  current_streak integer,
  roles text[],
  tier text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY
  SELECT
    p.id,
    p.display_name,
    p.username,
    p.avatar_url,
    p.created_at,
    COALESCE(s.total_xp, 0),
    COALESCE(s.current_streak, 0),
    COALESCE(ARRAY(SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.id), ARRAY[]::text[]),
    COALESCE(sub.tier, 'free')
  FROM public.profiles p
  LEFT JOIN public.user_stats s ON s.user_id = p.id
  LEFT JOIN public.subscribers sub ON sub.user_id = p.id
  ORDER BY p.created_at DESC
  LIMIT GREATEST(1, LEAST(_limit, 500));
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_admin_users(integer) TO authenticated;