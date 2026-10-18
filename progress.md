# Qelem Master Implementation & Audit Tracker (`progress.md`)

**Target:** Master Product Requirements Document (PRD v2.0) Alignment  
**Framework:** Next.js 16.3.8 App Router + React 19 + TypeScript + Supabase  
**Status:** In Active Execution (Phase 1)  
**Last Updated:** October 18, 2026  

---

## Master 4-Phase Roadmap & Status Matrix

| Phase | Description | Scope & Key Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Exam Security & CBT Realism** | Server-side grading, answer key sanitization, strikeout tool, diagram zoom, resilient session sync | **In Progress** |
| **Phase 2** | **Local Payment Rails** | Chapa Telebirr/CBE API, HMAC webhook, manual bank receipt upload, admin payment review | **Queued** |
| **Phase 3** | **Mistake Bank & Analytics** | Automated mistake tracking, 2-consecutive-correct graduation, `/mistakes` room, pacing diagnostics | **Queued** |
| **Phase 4** | **AI Tutor, Device Guard & Growth** | Gemini Flash conceptual tutor, 2-device anti-piracy fingerprinting, national & school leaderboards | **Queued** |

---

## Detailed Phase Breakdown

### [ ] Phase 1: Exam Security, Server-Side Grading & Authentic CBT Experience
- [ ] **1.1 Server-Side Answer Sanitization (`/api/exams/start`):**
  - Create `/api/exams/start` route to deliver exam metadata and questions *without* `correctOptionId`, `explanation`, or `derivationSteps`.
  - Ensure the client test room never receives the answer keys ahead of time.
- [ ] **1.2 Server-Side Grading Engine (`/api/exams/[id]/submit`):**
  - Implement `/api/exams/[id]/submit` that grades candidate answers on the server against verified question keys.
  - Calculate total score, percentage, grade-level breakdowns (Grades 9, 10, 11, 12), and award XP.
  - Validate time elapsed against `durationMinutes` to prevent client clock manipulation.
- [ ] **1.3 Exam Heartbeat & Autosave (`/api/exams/[id]/heartbeat`):**
  - Periodic 60-second synchronization of candidate progress to prevent lost answers during battery depletion or brief disconnects.
- [ ] **1.4 CBT Interface Realism Upgrades:**
  - Implement **Strikeout / Option Elimination tool** in the CBT test room allowing candidates to cross out eliminated options during deduction.
  - Add **Tap-to-Zoom Diagram Lightbox** for high-resolution physics circuits, biology diagrams, and chemistry structures.
- [ ] **1.5 Build & Type Verification:**
  - Verify zero TypeScript errors (`npm run type-check`) and run clean production build (`npm run build`).
  - Commit milestone checkpoint to Git for rollback safety.

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

### Baseline Checkpoint (October 18, 2026)
- **Git Commit:** `chore: baseline checkpoint prior to 4-phase PRD implementation`
- **Scope:** Clean baseline snapshot of existing codebase. All 17 static and dynamic App Router routes compiled cleanly.
- **Rollback Instructions:** If any unexpected issue occurs, you can revert completely to this baseline by running:
  ```bash
  git reset --hard "chore: baseline checkpoint prior to 4-phase PRD implementation"
  ```
- **Documentation:** `overview.md` updated with full 4-Phase System Architecture and emergency rollback procedures.
