-- ============================================================================
-- Qelem Database Migration: 006_mistake_bank_schema.sql
-- Description: Automated Mistake Bank & Spaced Repetition (2-Consecutive-Correct Graduation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.mistake_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  grade INT DEFAULT 12,
  fail_count INT DEFAULT 1,
  consecutive_correct INT DEFAULT 0,
  is_graduated BOOLEAN DEFAULT FALSE,
  notes TEXT,
  last_attempted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_question UNIQUE (user_id, question_id)
);

-- Indices for rapid querying & drill generation
CREATE INDEX IF NOT EXISTS idx_mistake_bank_user_subject 
  ON public.mistake_bank(user_id, subject_id, is_graduated);

CREATE INDEX IF NOT EXISTS idx_mistake_bank_user_graduated 
  ON public.mistake_bank(user_id, is_graduated, consecutive_correct);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mistake_bank ENABLE ROW LEVEL SECURITY;

-- Candidates can view only their own mistake bank
CREATE POLICY "Users can view own mistakes"
  ON public.mistake_bank
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Candidates can insert their own mistakes
CREATE POLICY "Users can insert own mistakes"
  ON public.mistake_bank
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Candidates can update their own mistakes (e.g., logging consecutive correct answers)
CREATE POLICY "Users can update own mistakes"
  ON public.mistake_bank
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Candidates can delete mistakes if explicitly dismissed
CREATE POLICY "Users can delete own mistakes"
  ON public.mistake_bank
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service Role Full Access
CREATE POLICY "Service role full access to mistake_bank"
  ON public.mistake_bank
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
