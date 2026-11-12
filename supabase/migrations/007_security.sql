-- ==============================================================================
-- Qelem Matric Prep — Production Hardening Security Migration
-- Migration: 007_security.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Profiles: Ensure Server-Enforced Role Column Exists & Guard Against Self-Promotion
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student' 
  CHECK (role IN ('student', 'admin', 'teacher'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Prevent unauthorized users from setting or altering their own role (self-promotion guard)
CREATE OR REPLACE FUNCTION public.guard_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Service role and postgres superuser can assign/change roles
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- On INSERT, force role to 'student' regardless of client input
  IF TG_OP = 'INSERT' THEN
    NEW.role := 'student';
    RETURN NEW;
  END IF;

  -- On UPDATE, reject any attempt by candidate to change role
  IF TG_OP = 'UPDATE' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Forbidden: users cannot modify their assigned role';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_profile_role ON public.profiles;
CREATE TRIGGER trg_guard_profile_role
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_role();


-- ------------------------------------------------------------------------------
-- 2. Payments: Drop and Recreate Hardened RLS Policies & Triggers
-- ------------------------------------------------------------------------------
-- Drop all existing legacy policies on payments
DROP POLICY IF EXISTS "Anyone can insert payment slips" ON public.payments;
DROP POLICY IF EXISTS "Candidates can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update payment status" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can select own payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can update payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can delete payments" ON public.payments;
DROP POLICY IF EXISTS "Service role full access on payments" ON public.payments;

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- SELECT: Authenticated users can view ONLY their own payments. Anon gets zero rows.
CREATE POLICY "Authenticated users can select own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: Authenticated users can insert ONLY their own payments with forced initial status.
CREATE POLICY "Authenticated users can insert own payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    status IN ('PENDING', 'MANUAL_REVIEW')
  );

-- Trigger to force user_id = auth.uid() and initial status on INSERT for non-service-role
CREATE OR REPLACE FUNCTION public.force_payment_initial_status()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    NEW.user_id := auth.uid();
    IF NEW.status NOT IN ('PENDING', 'MANUAL_REVIEW') THEN
      NEW.status := 'MANUAL_REVIEW';
    END IF;
    NEW.reviewed_at := NULL;
    NEW.admin_notes := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_force_payment_initial_status ON public.payments;
CREATE TRIGGER trg_force_payment_initial_status
  BEFORE INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.force_payment_initial_status();

-- UPDATE & DELETE: service_role ONLY. (Anon and authenticated cannot update/delete payments)
CREATE POLICY "Service role can update payments"
  ON public.payments FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete payments"
  ON public.payments FOR DELETE
  TO service_role
  USING (true);

-- ------------------------------------------------------------------------------
-- 3. Questions: Public Sanitized View & Column Privilege Restrictions
-- ------------------------------------------------------------------------------
-- Drop legacy policies granting public access to questions table
DROP POLICY IF EXISTS "Anyone can read questions" ON public.questions;
DROP POLICY IF EXISTS "Candidates can read questions" ON public.questions;
DROP POLICY IF EXISTS "Service role full access to questions" ON public.questions;

-- Ensure RLS is active on questions table
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Full table rows accessible only to service_role (for grading, seeding, and admin)
CREATE POLICY "Service role full access to questions"
  ON public.questions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Revoke direct table access from anon and authenticated roles
REVOKE ALL ON public.questions FROM anon, authenticated;

-- Create questions_public VIEW omitting sensitive answer keys, explanations, and derivation steps
DROP VIEW IF EXISTS public.questions_public;
CREATE OR REPLACE VIEW public.questions_public AS
SELECT
  id,
  subject,
  stream,
  grade_level,
  unit_number,
  unit_title,
  exam_year,
  exam_paper_code,
  difficulty,
  prompt,
  options,
  created_at
FROM public.questions;

-- Grant SELECT on public view to anon and authenticated clients
GRANT SELECT ON public.questions_public TO anon, authenticated, service_role;
