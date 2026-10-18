-- ==============================================================================
-- Qelem Matric Prep — Security Patch: Secure Questions Table RLS
-- Migration: 004_fix_questions_rls.sql
-- ==============================================================================

-- Restrict INSERT / UPDATE / DELETE on public.questions to service_role or admin users only.
-- Anonymous and regular authenticated users retain SELECT (read-only) privileges.

DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Service role can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Service role can update questions" ON public.questions;
DROP POLICY IF EXISTS "Service role can delete questions" ON public.questions;

CREATE POLICY "Service role can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Service role can update questions"
  ON public.questions FOR UPDATE
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Service role can delete questions"
  ON public.questions FOR DELETE
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'service_role');
