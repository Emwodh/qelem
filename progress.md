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
| **Phase 2** | **Local Payment Rails (CBE & Telebirr)** | Direct CBE/Telebirr transfer reference submission, receipt upload, admin approval portal, Pro access | **Completed** |
| **Phase 3** | **Mistake Bank & Analytics** | Automated mistake tracking, 2-consecutive-correct graduation, `/mistakes` room, pacing diagnostics | **Next Up** |
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

### [x] Phase 2: Local Payment Rails (CBE & Telebirr Manual Receipts & Admin Portal)
- [x] **2.1 Manual Bank Transfer Specification:**
  - Configured verified Ethiopian banking destination details:
    - **Telebirr:** `0911 23 45 67` (Account Name: `Qelem Education`)
    - **Commercial Bank of Ethiopia (CBE):** `1000 4567 89123` (Account Name: `Qelem Matric Prep / ቀለም`)
    - **Pricing:** Season Pass (349 ETB) & All-Access Pass (999 ETB).
  - Automated Chapa gateway intentionally deferred per user instruction in favor of direct CBE/Telebirr reference validation.
- [x] **2.2 Student Payment Submission Modal (`UpgradeModal.tsx`):**
  - Re-engineered `UpgradeModal.tsx` to provide 1-click account number copying, transaction ID / reference code input, optional receipt screenshot upload (with client compression), and pending status feedback.
- [x] **2.3 Client & Server Store Architecture:**
  - Created [`src/types/payment.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/payment.ts): Defined `PaymentMethod` ('telebirr' | 'cbe'), `PaymentStatus` ('MANUAL_REVIEW' | 'COMPLETED' | 'REJECTED'), and `PaymentRecord`.
  - Created [`src/lib/paymentStore.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/paymentStore.ts): Client-first payment submission and caching with Supabase sync.
  - Enhanced [`src/lib/userStore.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/userStore.ts) & [`src/types/user.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/user.ts) to track `isPro`, `plan`, and `pendingPayment` with local persistence.
- [x] **2.4 Supabase Payments Migration:**
  - Created [`supabase/migrations/005_payments_schema.sql`](file:///c:/Users/emwod/Downloads/Qelem/supabase/migrations/005_payments_schema.sql) with RLS policies allowing authenticated users to insert their payment receipts and admins to review.
- [x] **2.5 Admin Payment Review & Verification Portal:**
  - Created [`/admin/payments`](file:///c:/Users/emwod/Downloads/Qelem/src/app/(dashboard)/admin/payments/page.tsx) with passkey protection, metric cards, status filtering, receipt image zoom lightbox, and 1-click Approve / Reject actions.
  - Created [`/api/payments/manual`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/payments/manual/route.ts), [`/api/admin/payments`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/admin/payments/route.ts), and [`/api/admin/payments/review`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/admin/payments/review/route.ts).
- [x] **2.6 Build & Route Verification:**
  - Added "Payment Slips" admin navigation item in `Sidebar.tsx`.
  - Full TypeScript and Webpack builds compiled 22 static and dynamic routes with 0 errors.

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

### Milestone 2: Phase 2 Completed (October 18, 2026)
- **Scope:** Local Payment Rails (Direct CBE & Telebirr Manual Receipts & Admin Approval Portal).
- **Files Created:**
  - [`src/types/payment.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/payment.ts): Type definitions for `PaymentMethod`, `PaymentStatus`, and `PaymentRecord`.
  - [`src/lib/paymentStore.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/paymentStore.ts): Client-first payment submission, caching, and Supabase cloud sync.
  - [`supabase/migrations/005_payments_schema.sql`](file:///c:/Users/emwod/Downloads/Qelem/supabase/migrations/005_payments_schema.sql): Table `public.payments` with RLS policies for students and admins.
  - [`src/app/api/payments/manual/route.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/payments/manual/route.ts): Public student API endpoint to submit transaction numbers and screenshot receipts.
  - [`src/app/api/admin/payments/route.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/admin/payments/route.ts): Admin API endpoint to retrieve and filter submitted slips.
  - [`src/app/api/admin/payments/review/route.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/app/api/admin/payments/review/route.ts): Admin API endpoint to approve/reject slips and activate Pro plans.
  - [`src/app/(dashboard)/admin/payments/page.tsx`](file:///c:/Users/emwod/Downloads/Qelem/src/app/(dashboard)/admin/payments/page.tsx): Comprehensive admin verification portal with passkey protection, live search/filtering, image zoom, and 1-click approvals.
- **Files Enhanced:**
  - [`src/components/billing/UpgradeModal.tsx`](file:///c:/Users/emwod/Downloads/Qelem/src/components/billing/UpgradeModal.tsx): Ethiopian mobile banking transfer UI (Telebirr & CBE accounts, 1-click copy, slip upload, pending review state).
  - [`src/types/user.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/user.ts): Added `isPro`, `plan`, and `pendingPayment` fields.
  - [`src/lib/userStore.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/userStore.ts): Added `isUserPro()`, `activateUserPro()`, and `setUserPendingPayment()`.
  - [`src/components/dashboard/Sidebar.tsx`](file:///c:/Users/emwod/Downloads/Qelem/src/components/dashboard/Sidebar.tsx): Added "Payment Slips" navigation link under Administration.
- **Verification:**
  - TypeScript type-check passed (`npm run lint` -> 0 errors).
  - Production build passed (`npm run build` -> 22 routes bundled successfully).
- **Rollback Instructions:**
  To revert Phase 2 changes back to Phase 1 checkpoint:
  ```bash
  git reset --hard 9b0d87a
  ```

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

