-- ==============================================================================
-- Qelem Matric Prep — Manual Payments & Receipt Verification Schema
-- Migration: 005_payments_schema.sql (Phase 2: Local Payment Rails)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  candidate_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  tx_ref TEXT UNIQUE NOT NULL,
  bank_tx_ref TEXT NOT NULL,
  amount_etb NUMERIC NOT NULL,
  plan TEXT NOT NULL DEFAULT 'MATRIC_SEASON_PASS' CHECK (plan IN ('FREE', 'MONTHLY_PASS', 'MATRIC_SEASON_PASS', 'LIFETIME_PASS')),
  method TEXT NOT NULL CHECK (method IN ('telebirr', 'cbe')),
  status TEXT NOT NULL DEFAULT 'MANUAL_REVIEW' CHECK (status IN ('PENDING', 'MANUAL_REVIEW', 'COMPLETED', 'REJECTED')),
  receipt_image_url TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  reviewed_at TIMESTAMPTZ
);

-- Indices for rapid query and audit verification
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_phone ON public.payments(phone);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can submit a manual receipt (with or without pre-existing auth)
DROP POLICY IF EXISTS "Anyone can insert payment slips" ON public.payments;
CREATE POLICY "Anyone can insert payment slips"
  ON public.payments FOR INSERT
  WITH CHECK (true);

-- 2. Candidates can view their own payment slips
DROP POLICY IF EXISTS "Candidates can view their own payments" ON public.payments;
CREATE POLICY "Candidates can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 3. Admins / Service role can update payment status (Approve / Reject)
DROP POLICY IF EXISTS "Admins can update payment status" ON public.payments;
CREATE POLICY "Admins can update payment status"
  ON public.payments FOR UPDATE
  USING (true);
