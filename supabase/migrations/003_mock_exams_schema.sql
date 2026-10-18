-- ==============================================================================
-- Qelem Matric Prep (Grades 9–12) — Mock Exam Sessions Schema
-- Migration: 003_mock_exams_schema.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.mock_exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  answers JSONB NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_mock_exam_sessions_user_id ON public.mock_exam_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_exam_sessions_completed_at ON public.mock_exam_sessions(completed_at DESC);

-- Enable RLS
ALTER TABLE public.mock_exam_sessions ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Candidates can view their own mock sessions" ON public.mock_exam_sessions;
CREATE POLICY "Candidates can view their own mock sessions"
  ON public.mock_exam_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Candidates can record mock sessions" ON public.mock_exam_sessions;
CREATE POLICY "Candidates can record mock sessions"
  ON public.mock_exam_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
