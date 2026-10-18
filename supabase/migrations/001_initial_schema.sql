-- ==============================================================================
-- Qelem Matric Prep (Grades 9–12) — Initial Supabase PostgreSQL Schema
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  stream TEXT NOT NULL DEFAULT 'natural' CHECK (stream IN ('natural', 'social')),
  grade INTEGER NOT NULL DEFAULT 12 CHECK (grade IN (9, 10, 11, 12)),
  target_score INTEGER NOT NULL DEFAULT 585 CHECK (target_score >= 0 AND target_score <= 700),
  target_university TEXT NOT NULL DEFAULT 'Addis Ababa University (AAU) — Technology (Faculty of Tech)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast user profile lookup
CREATE INDEX IF NOT EXISTS idx_profiles_stream ON public.profiles(stream);

-- 2. PRACTICE SESSIONS TABLE (Diagnostic & Mock Exam Attempts)
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stream TEXT NOT NULL DEFAULT 'natural' CHECK (stream IN ('natural', 'social')),
  score_percentage INTEGER NOT NULL CHECK (score_percentage >= 0 AND score_percentage <= 100),
  total_questions INTEGER NOT NULL DEFAULT 10,
  correct_count INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  weakest_topic TEXT,
  predicted_tier TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for querying candidate session history
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_completed_at ON public.practice_sessions(completed_at DESC);

-- ==============================================================================
-- 3. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Candidates can view their own profile" ON public.profiles;
CREATE POLICY "Candidates can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Candidates can insert their own profile" ON public.profiles;
CREATE POLICY "Candidates can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Candidates can update their own profile" ON public.profiles;
CREATE POLICY "Candidates can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Practice Sessions Policies
DROP POLICY IF EXISTS "Candidates can view their own sessions" ON public.practice_sessions;
CREATE POLICY "Candidates can view their own sessions"
  ON public.practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Candidates can record practice sessions" ON public.practice_sessions;
CREATE POLICY "Candidates can record practice sessions"
  ON public.practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 4. AUTOMATIC PROFILE INITIALIZATION TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    stream,
    target_university
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Grade 12 Candidate'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'stream', 'natural'),
    COALESCE(NEW.raw_user_meta_data->>'target_university', 'Addis Ababa University (AAU) — Technology (Faculty of Tech)')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    stream = EXCLUDED.stream,
    target_university = EXCLUDED.target_university,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run whenever a new user signs up in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
