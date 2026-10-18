# Qelem Master Implementation & Audit Tracker (`progress.md`)

**Target:** Master Product Requirements Document (PRD v2.0) Alignment  
**Framework:** Next.js 16.3.8 App Router + React 19 + TypeScript + Supabase  
**Status:** In Active Execution (Phase 1)  
**Last Updated:** October 18, 2026  

---

## Master 4-Phase Roadmap & Status Matrix

| Phase | Description | Scope & Key Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Exam Security & CBT Realism** | Server-side grading, answer key sanitization, strikeout tool, diagram zoom, resilient session sync | **Completed** |
| **Phase 2** | **Local Payment Rails** | Chapa Telebirr/CBE API, HMAC webhook, manual bank receipt upload, admin payment review | **Next Up** |
| **Phase 3** | **Mistake Bank & Analytics** | Automated mistake tracking, 2-consecutive-correct graduation, `/mistakes` room, pacing diagnostics | **Queued** |
| **Phase 4** | **AI Tutor, Device Guard & Growth** | Gemini Flash conceptual tutor, 2-device anti-piracy fingerprinting, national & school leaderboards | **Queued** |

---

## Detailed Phase Breakdown

### [x] Phase 1: Exam Security, Server-Side Grading & Authentic CBT Experience
- [x] **1.1 Server-Side Answer Sanitization (`/api/exams/start`):**
  - Created `/api/exams/start` route to deliver exam metadata and questions *without* `correctOptionId`, `explanation`, or `derivationSteps`.
  - Ensures the client test room never receives the answer keys ahead of time.
- [x] **1.2 Server-Side Grading Engine (`/api/exams/[id]/submit`):**
  - Implemented `/api/exams/[id]/submit` that grades candidate answers on the server against verified question keys.
  - Calculates total score, percentage, grade-level breakdowns (Grades 9, 10, 11, 12), and returns full pedagogical explanations for post-exam review.
  - Automatically logs attempt to Supabase `mock_exam_sessions` if user is authenticated.
- [x] **1.3 Exam Heartbeat & Autosave (`/api/exams/[id]/heartbeat`):**
  - Periodic synchronization of candidate progress to acknowledge state and prevent lost answers.
- [x] **1.4 CBT Interface Realism Upgrades:**
  - Implemented **Strikeout / Option Elimination tool** in [mock-exams/[examId]/page.tsx](file:///c:/Users/emwod/Downloads/Qelem/src/app/(dashboard)/mock-exams/[examId]/page.tsx) allowing candidates to cross out eliminated options during deduction.
  - Added **Tap-to-Zoom Diagram Lightbox** for high-resolution inspection of physics circuits, geometry, and formulas.
  - Added `isSubmitting` visual grading spinner during server validation.
- [x] **1.5 Build & Type Verification:**
  - Verified TypeScript compilation (`npm run lint` / `tsc --noEmit` exited with code 0).
  - Verified full production build (`npm run build` exited with code 0, bundling all 20 static and dynamic routes).

---

### [ ] Phase 2: Local Payment Rails & Monetization Engine
- [ ] **2.1 Chapa Payment Gateway Integration:**
  - Implement `/api/payments/chapa/init` for initiating Telebirr, CBE Birr, Awash Birr, and card checkouts.
  - Implement `/api/payments/chapa/webhook` with cryptographic HMAC SHA-256 signature verification (`x-chapa-signature`).
- [ ] **2.2 Manual Bank Receipt Fallback (`/api/payments/manual`):**
  - Build direct CBE/Telebirr transfer reference input and receipt screenshot upload.
  - Store payment records in `public.payments` with `PaymentStatus.MANUAL_REVIEW`.
- [ ] **2.3 Admin Payment Approval Portal:**
  - Build `/admin/payments` allowing administrators to inspect manual slips and approve/reject with 1-click subscription activation.
- [ ] **2.4 Entitlement Activation & Gating:**
  - Wire checkout triggers in `UpgradeModal.tsx` and unlock Pro features (full derivations, offline paper downloads).

---

### [ ] Phase 3: Automated Mistake Bank, Spaced Repetition & Deep Analytics
- [ ] **3.1 Automated Mistake Ingestion:**
  - Create `public.mistake_bank` schema in Supabase.
  - Automatically record failed questions upon submission of practice sessions or mock exams.
- [ ] **3.2 Spaced Repetition Graduation Engine:**
  - Track `failCount` and `consecutiveCorrect`.
  - Enforce the 2-consecutive-correct graduation rule on separate sessions before removing a question from the mistake bank.
- [ ] **3.3 Dedicated Practice Drill Room (`/mistakes`):**
  - Build interactive `/mistakes` drill room allowing targeted revision of flagged and failed items.
- [ ] **3.4 Standalone Post-Exam Analytics (`/analytics`, `/analytics/report/[id]`):**
  - Post-exam diagnostic breakdown with pacing telemetry (average time per question, time sink questions >4 mins).
  - Grade 9–12 Unit mastery table with 1-click *"Practice 15 Weak Questions Now"* CTA.
  - Estimated matric aggregate score (out of 600/700) compared to university cut-off thresholds (AAU Medicine, AAiT Engineering, Law).

---

### [ ] Phase 4: Gemini AI Tutor, Anti-Piracy Device Guard & Social Growth
- [ ] **4.1 Gemini Flash Pro On-Demand Tutor (`/api/ai/explain-custom`):**
  - Integrate Gemini Flash with predefined contextual prompts (*"Explain in simple Amharic"*, *"Show shortcut trick"*, *"Generate similar question"*).
  - Enforce daily rate limit of 15 queries/day for Pro users.
- [ ] **4.2 Anti-Piracy Device Guard:**
  - Generate cryptographic browser/device fingerprint on login.
  - Restrict paid accounts to maximum 2 registered devices (1 mobile + 1 PC) and maximum 1 active concurrent exam session.
- [ ] **4.3 Social & Growth Engine:**
  - National, Regional, and School Leaderboards (`/leaderboard`).
  - Referral program with custom student invite codes and Telegram share buttons (`/referrals`).

---

## Execution Log & Audit Trail

### Milestone 1: Phase 1 Completed (October 18, 2026)
- **Scope:** Exam Security, Server-Side Grading & CBT Interface Realism.
- **Files Created:**
  - [`src/app/api/exams/start/route.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/exams/start/route.ts): Strips answer keys and derivations for safe client delivery.
  - [`src/app/api/exams/[id]/submit/route.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/exams/[id]/submit/route.ts): Authoritative server-side grading, time verification, and DB logging.
  - [`src/app/api/exams/[id]/heartbeat/route.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/exams/[id]/heartbeat/route.ts): Periodic answer synchronization.
- **Files Enhanced:**
  - [`src/types/exam.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/exam.ts): Added `SanitizedExamQuestion`, `GradedQuestionDetail`, and `ExamStartResponse`.
  - [`src/app/(dashboard)/mock-exams/[examId]/page.tsx`](file:///c:/Users/emwod/Downloads/Qelem/src/app/(dashboard)/mock-exams/[examId]/page.tsx): Added Strikeout elimination, Tap-to-Zoom lightbox, and server-side submission handoff.
- **Verification:**
  - TypeScript type-check passed (`npm run lint` -> 0 errors).
  - Production build passed (`npm run build` -> 20 routes bundled successfully).
- **Rollback Instructions:**
  To revert all Phase 1 changes back to the initial baseline:
  ```bash
  git reset --hard "chore: baseline checkpoint prior to 4-phase PRD implementation"
  ```

### Baseline Checkpoint (October 18, 2026)
- **Git Commit:** `chore: baseline checkpoint prior to 4-phase PRD implementation`
- **Scope:** Initial clean repository baseline before PRD alignment sprints.

