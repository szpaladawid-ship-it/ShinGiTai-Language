ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS teacher_avatar text NOT NULL DEFAULT 'nova';
ALTER TABLE public.flashcards ADD COLUMN IF NOT EXISTS emoji text;