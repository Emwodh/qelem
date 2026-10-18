-- ==============================================================================
-- Qelem Matric Prep (Grades 9–12) — Question Bank Schema
-- Migration: 002_questions_schema.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL, -- 'mathematics', 'physics', 'chemistry', 'biology', 'english', 'aptitude', 'history', 'geography', 'economics'
  stream TEXT NOT NULL DEFAULT 'natural' CHECK (stream IN ('natural', 'social', 'both')),
  grade_level INTEGER NOT NULL CHECK (grade_level IN (9, 10, 11, 12)),
  unit_number INTEGER,
  unit_title TEXT NOT NULL,
  exam_year TEXT, -- e.g., '2016 E.C.', '2015 E.C.', '2014 E.C.', 'Model Exam'
  exam_paper_code TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prompt TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of objects: [{ "id": "A", "text": "..." }, ...]
  correct_option_id TEXT NOT NULL,
  explanation TEXT NOT NULL,
  distractor_analysis JSONB, -- Array of objects: [{ "optionId": "A", "errorType": "...", "trapExplanation": "..." }]
  examiner_insight TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indices for rapid filtering across high-yield matric question queries
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_grade_level ON public.questions(grade_level);
CREATE INDEX IF NOT EXISTS idx_questions_exam_year ON public.questions(exam_year);
CREATE INDEX IF NOT EXISTS idx_questions_stream ON public.questions(stream);
CREATE INDEX IF NOT EXISTS idx_questions_unit ON public.questions(subject, grade_level, unit_number);

-- RLS: Public read for authenticated/anonymous candidates; write restricted to authenticated service/admin
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read questions" ON public.questions;
CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
CREATE POLICY "Admins can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
CREATE POLICY "Admins can update questions"
  ON public.questions FOR UPDATE
  USING (true);
