# Phase 0 Truth Audit & Hardening Report

**Project:** Qelem (ቀለም) — Ethiopian Matric / EUEE Digital Exam Preparation  
**Repository:** `github.com/Emwodh/qelem`  
**Working Directory:** `c:\Users\emwod\Downloads\Qelem`  
**Audit Date:** November 2026  
**Auditor:** Senior Security Full-Stack Engineer  
**Status:** Phase 0 Codebase Hardening & Verification Complete — Awaiting Human Environment & Ministry Actions

---

## 1. Executive Summary & Quality Gates

Phase 0 ("Truth Audit & Hardening") establishes an uncompromised, verifiable baseline for the Qelem platform. The codebase has transitioned from an unhardened prototype with client-side secret bypasses and silent fallback behavior into a production-disciplined application where all administrative surfaces fail closed, authentication is cryptographically validated, production configuration is strictly asserted, and legal rights regarding Ethiopian national exam materials are transparently registered.

### Core Quality Gate Evidence

| Gate | Command | Result | Evidence / Details |
| :--- | :--- | :--- | :--- |
| **Clean Install** | `npm ci` | Passed | 0 missing dependencies, synchronized `package-lock.json` |
| **Type Check** | `npm run type-check` | Passed (0 errors) | `tsc --noEmit` exited with code 0 across entire TypeScript AST |
| **Unit & Security Tests** | `npm test` | Passed (6/6 Auth0 + 6/6 Admin) | Verified Auth0 PKCE routes and Admin Gate security matrix |
| **Production Build** | `npm run build` | Passed (28/28 routes) | Static optimization & Turbopack production bundle compiled |
| **Live Server Probe** | `GET /` | HTTP 200 OK | Home page loads successfully |
| **Live Server Probe** | `GET /dashboard` | HTTP 200 OK | Student dashboard loads with local-first hydration |
| **Live Server Probe** | `GET /admin` (no auth) | HTTP 200 (Passkey UI) | SSR and client render zero leaked tables, candidates, or secrets |
| **Live Server Probe** | `POST /api/admin/verify` (bad key) | HTTP 401 Unauthorized | Rejected with `{ valid: false, error: 'Invalid admin passkey' }` |
| **Live Server Probe** | `GET /api/admin/payments` (no key) | HTTP 401 Unauthorized | Rejected with `{ error: 'Unauthorized: Valid administrator passkey...' }` |
| **Live Server Probe** | `POST /api/admin/payments/review` | HTTP 401 Unauthorized | Rejected with 401 fail-closed |
| **Live Server Probe** | `POST /api/admin/parse-file` | HTTP 401 Unauthorized | Rejected with 401 fail-closed |
| **Production Audit** | `npm audit --omit=dev` | 8 vulnerabilities | 2 moderate, 6 high (browserslist, glob, minimatch, source-map-js, zod) |

---

## 2. Phase 0 Task Verification Table

| Task ID | Task Description | Status | Evidence Reference | Notes / Implementation |
| :--- | :--- | :--- | :--- | :--- |
| **T1** | **Re-rotate Admin Secret** | `DONE-VERIFIED` | `git grep -n -i "qelem-admin-2017"` -> 0 matches.<br>`git ls-files .env.local` -> untracked.<br>`git status --ignored` -> `!! .env.local`. | Re-generated 64-character CSPRNG secret into `.env.local` without terminal/log disclosure. Removed all historical passkey tokens from tracked docs. |
| **T2** | **Verify & Harden Admin Gate** | `DONE-VERIFIED` | `scripts/test-admin-gate.mjs` passed.<br>`src/lib/adminAuth.ts`<br>`src/app/api/admin/verify/route.ts` | Fails closed if unset. Timing-safe comparison (`crypto.timingSafeEqual` with pre-hashed SHA-256). Rate limiting (5 attempts/15 min). HMAC-SHA256 session cookie (`HttpOnly; SameSite=Strict; Secure`). All `/api/admin/*` endpoints strictly verify credentials server-side. |
| **T3** | **Auth0 Guard Correctness** | `DONE-VERIFIED` | `src/lib/envConfig.ts`<br>`src/proxy.ts`<br>`scripts/verify-auth0-integration.mjs` | `assertProductionConfig()` enforces required env vars at startup. In dev, missing Auth0 vars log clear warnings and allow local preview; in production, missing vars throw fatal 500 errors. |
| **T4** | **Silent-Fallback Safety** | `DONE-VERIFIED` | `src/lib/paymentStore.ts`<br>`src/app/api/payments/manual/route.ts`<br>`src/components/ui/DevFallbackBanner.tsx` | In production, financial transactions and candidate slips throw explicit HTTP 503 errors if Supabase is offline, preventing unrecoverable localStorage loss. Visible dev banner indicates fallback mode. |
| **T5** | **Git & Repo Hygiene** | `DONE-VERIFIED` | `git status`<br>`git ls-files \| findstr /i "env"` -> only `.env.example`.<br>`README.md` updated to npm v10+. | Purged legacy scratch files, Stitch prototypes, and stale `pnpm-lock.yaml`. Single package manager is `npm`. Documented all root leftovers with cleanup proposal. |
| **T6** | **License & Ministry Rights** | `DONE-VERIFIED` | `LICENSE`<br>`docs/CONTENT_RIGHTS.md`<br>`docs/DRAFT_EAES_PERMISSION_LETTER.md` | Removed invalid "fair use" assertions. Clarified codebase/derivations are proprietary. Past exam papers cataloged under "Permission Requested" status. Formal draft letter prepared for EAES Director General. |
| **T7** | **Quality Gates & CI** | `DONE-VERIFIED` | `.github/workflows/ci.yml`<br>`npm test`<br>`npm run build` | Added GitHub Actions CI workflow executing `npm ci`, `type-check`, `npm test`, and `next build`. Executed live HTTP probe tests against production build. |
| **T8** | **Honest Status Report** | `DONE-VERIFIED` | `docs/PHASE0_REPORT.md` (this file) | Truthful, evidence-based documentation of system state, risks, and human obligations. |

---

## 3. What Still Works Only Locally (Data Loss Risks)

Because the configured remote Supabase instance (`ikjuhihyurabieepyizq.supabase.co`) does not currently resolve via DNS (`ENOTFOUND`), the application operates in development mode via local-first fallback stores. The following features store state in browser `localStorage` or process memory:

| Feature / Store | Storage Mechanism | Dev Behavior | Production Behavior (Hardened) | Data Loss & Integrity Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Manual Payments & Slips** (`paymentStore.ts`, `/api/payments/manual`) | In-memory + `localStorage` | Allowed (simulates slip submission & admin approval) | **BLOCKED (HTTP 503)**. Fails closed with explicit error message requiring real database connectivity. | **CRITICAL RISK in Dev:** If candidate clears browser storage, refreshes private window, or switches devices, payment slip and pending status are permanently lost. |
| **Candidate Profile & Auth** (`userStore.ts`) | `localStorage` (`qelem_user_state`) | Saves candidate grade, stream (Natural Science), and name locally | In production, relies on Auth0 claims + Supabase user table | **HIGH RISK in Dev:** Switching devices resets candidate grade, study schedule, and account tier back to unpaid trial. |
| **Mistake Journal & Streaks** (`mistakeStore.ts`) | `localStorage` (`qelem_mistake_journal`) | Tracks answered questions, spaced repetition queues, and graduation streaks locally | Reads/writes to local store | **MEDIUM RISK in Dev:** Learning analytics and mastery streak counters do not sync across multiple candidate devices. |
| **Question Bank & Ingestion** (`questionStore.ts`) | Static JSON seeds + `localStorage` | Ingests PDF/JSON questions into local client state | Reads from bundled static past exams when DB is unreachable | **MEDIUM RISK:** Admin file uploads in dev are saved only to the current browser session. |
| **Admin Audit Trail** (`auditStore.ts`) | `localStorage` (`qelem_admin_audit_logs`) | Records administrative approval events locally | In-memory/client fallback | **COMPLIANCE RISK:** Audit logs are vulnerable to client-side clearance or tampering in dev mode. |

---

## 4. Known Platform Risks & Constraints

1. **Content Volume & Coverage Asymmetry:**
   - The question bank currently contains **102 questions** covering **one single exam year (2017 E.C. / 2024 G.C.)**.
   - Only **Natural Science stream** subjects (Mathematics, Physics, Chemistry, Biology) have questions populated.
   - Social Science stream subjects (History, Geography, Economics) and General subjects (English, Civics, Aptitude) have 0 questions in the bank.
2. **Database Connectivity:**
   - Remote Supabase host `ikjuhihyurabieepyizq.supabase.co` is inactive, paused, or deleted. Until a human reconnects an active Supabase project, all server persistence is halted.
3. **Admin Credential Architecture:**
   - The administrative portal relies on a single shared symmetric master key (`ADMIN_SECRET_KEY`) rather than individual administrator accounts with Role-Based Access Control (RBAC). A compromise of this single key grants full control over questions and payments.
4. **PWA & Offline Capability:**
   - The Serwist Service Worker bundle is configured and builds statically, but offline caching has not yet been benchmarked on low-end Android mobile devices with fluctuating 2G/3G connectivity in regional Ethiopia.
5. **Dependency Vulnerabilities (`npm audit`):**
   - 8 vulnerabilities (2 moderate, 6 high):
     - `zod <4.6.6`: Memory exhaustion via constrained collections (ecosystem-wide on Zod 3.x).
     - `browserslist <=4.28.6`: Memory growth in query caching (via Serwist build tools).
     - `source-map-js 1.0.0-1.2.1`: DoS through section offsets (via PostCSS/Next build tools).
     - `glob 9.0.0-14.0.1` & `minimatch 7.0.0-11.0.0`: Path traversal/DoS risks in build tooling.

---

## 5. Repository Leftovers Analysis & Proposed Documentation Structure

Ground Rule 5 requires user approval before deleting files outside scope. Below is the full audit of leftover files in the repository root and the proposed permanent structure.

### Root Leftovers Inventory

| File / Directory | Size | Origin | Recommendation |
| :--- | :--- | :--- | :--- |
| `stitch_tools.json` | 333 KB | Figma Stitch MCP generated schemas | **Delete** (Not referenced by Next.js application runtime or build). |
| `.agents/` & `skills-lock.json` | ~12 MB | Legacy local skill checkouts & Oct 2026 agent chat logs | **Delete or Archive** (Skills are now managed globally; logs are historical). |
| `CLAUDE.md` | 11 B | Empty placeholder (`# Claude\n`) | **Delete** (Provides zero guidance). |
| `AGENTS.md` | 679 B | Next.js 16 agent rules auto-injected by `next dev` | **Keep in Root** (Mandatory Next.js 16 file). |
| `overview.md` | 12.6 KB | Early system overview | **Migrate to docs/ARCHITECTURE.md** then remove. |
| `progress.md` | 18.3 KB | Historical task tracking log | **Migrate to CHANGELOG.md** then remove. |
| `DESIGN.md` | 4.7 KB | Ethiopian cultural palette & dark theme tokens | **Move to docs/DESIGN.md**. |
| `PROJECT_RULES.md` | 3.5 KB | Coding standards and project constraints | **Move to docs/PROJECT_RULES.md**. |
| `qelem_production_prd.md` | 35.2 KB | Reconciled Product Requirements Document | **Move to docs/PRD.md**. |

### Proposed Target `docs/` Architecture

```
Qelem/
├── README.md                      # Entry point, stack, quickstart, security & env guide
├── LICENSE                        # Proprietary code license & Ethiopian exam notice
├── CHANGELOG.md                   # Consolidated milestone history (from progress.md)
├── docs/
│   ├── PRD.md                     # Reconciled Product Requirements Document
│   ├── ARCHITECTURE.md            # System design, data flow, Auth0 + Supabase architecture
│   ├── DESIGN.md                  # Design system tokens, typography, and color rules
│   ├── PROJECT_RULES.md           # Engineering guidelines and coding rules
│   ├── CONTENT_RIGHTS.md          # National exam source catalog and rights registry
│   ├── DRAFT_EAES_PERMISSION_LETTER.md # Formal permission request letter for EAES/MoE
│   └── PHASE0_REPORT.md           # This verification audit report
```

---

## 6. PRD Claims Reconciliation (Built vs. Partial vs. Planned)

The Product Requirements Document (`qelem_production_prd.md`) was audited against the active Next.js 16 codebase:

| PRD Feature / Claim | Status | Actual Codebase Reality |
| :--- | :--- | :--- |
| **Authentication: Auth0 OIDC/PKCE** | `Built` | Implemented via `@auth0/nextjs-auth0`. Dedicated `/auth/login`, `/auth/logout`, `/auth/callback` routes. Legacy custom login/signup pages removed. |
| **App Framework: Next.js 16 App Router** | `Built` | Running Next.js 16.4.3 with React 19, Turbopack, and TypeScript 5.7. 28 verified routes. |
| **Manual Ethiopian Payment Rails (Telebirr, CBE)** | `Built` | Slip upload UI, candidate submission endpoint (`/api/payments/manual`), admin slip reviewer (`/admin/payments`), approval and rejection mutations. |
| **Automated Payment Gateways (Chapa, Telebirr Direct)** | `Planned` | Not yet built. Documented for Phase 1+ automated webhook processing. |
| **Question Ingestion & Parser** | `Built` | PDF and JSON parser (`/api/admin/parse-file`) with KaTeX formula support, bulk upload UI, and question bank table. |
| **Natural Science Question Bank (2017 E.C.)** | `Built` | 102 questions seeded across Maths, Physics, Chemistry, Biology. |
| **Social Science Question Bank** | `Planned` | 0 questions seeded. Requires curriculum data entry. |
| **Exam Engine & Instant Feedback** | `Built` | Full exam simulator (`/mock-exams/[examId]`), timer heartbeat (`/api/exams/[id]/heartbeat`), submission grader (`/api/exams/[id]/submit`). |
| **Mistake Journal & Spaced Repetition** | `Partial` | Frontend mistake tracker and graduation streak logic built (`mistakeStore.ts`); backend PostgreSQL persistence pending database connection. |
| **Offline PWA Engine** | `Partial` | Serwist service worker configured and compiling; physical device offline sync and cache invalidation pending device testing. |
| **AI Personal Tutor (Qelem AI)** | `Planned` | Out of scope for Phase 0. Reserved for Phase 2. |
| **Leaderboards & Peer Challenges** | `Planned` | Out of scope for Phase 0. Reserved for Phase 3. |

---

## 7. Action Required by a Human ("NEEDS HUMAN")

The following 5 tasks cannot be completed autonomously and require explicit manual action by repository administrators:

### 1. Set Production Environment Variables
Configure the following secrets in your production deployment dashboard (e.g., Vercel, Railway, or AWS):
- `ADMIN_SECRET_KEY`: Set to a strong, 64-character hex string generated locally via `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `AUTH0_SECRET`: 32+ byte encryption key for Auth0 session cookies.
- `AUTH0_DOMAIN`: Your Auth0 tenant domain (e.g., `qelem.us.auth0.com`).
- `AUTH0_CLIENT_ID`: Auth0 Regular Web Application Client ID.
- `AUTH0_CLIENT_SECRET`: Auth0 Application Client Secret.
- `APP_BASE_URL`: Full canonical production domain (e.g., `https://qelem.edu.et` or `https://qelem-prep.vercel.app`).
- `NEXT_PUBLIC_SUPABASE_URL`: Active Supabase project URL (`https://<project-ref>.supabase.co`).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client anon public key.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (kept strictly server-side).

### 2. Toggle GitHub Repository to Private
The repository currently contains past Ethiopian national exam papers whose formal copyright clearance is pending review.
- **Step 1:** Go to `https://github.com/Emwodh/qelem`.
- **Step 2:** Click **Settings** (tab).
- **Step 3:** Scroll to the bottom to the **Danger Zone**.
- **Step 4:** Under **Change repository visibility**, click **Change visibility**.
- **Step 5:** Select **Make private** and confirm.

### 3. Re-provision or Unpause Supabase Database
The host `ikjuhihyurabieepyizq.supabase.co` is currently dead/unresolvable (`ENOTFOUND`).
- **Step 1:** Log into `https://supabase.com/dashboard`.
- **Step 2:** Check if the project `ikjuhihyurabieepyizq` was paused due to inactivity, or create a new project named `qelem-production`.
- **Step 3:** Run the database schema migrations located in `supabase/migrations/`.
- **Step 4:** Copy the new Project URL and API Keys into `.env.local` and your production deployment platform.

### 4. Configure Auth0 Application & Callback URLs
- **Step 1:** In the Auth0 Management Dashboard, open your Application settings.
- **Step 2:** Under **Allowed Callback URLs**, add:
  - `http://localhost:3000/auth/callback` (for local development)
  - `https://<your-production-domain>/auth/callback` (for production)
- **Step 3:** Under **Allowed Logout URLs**, add:
  - `http://localhost:3000`
  - `https://<your-production-domain>`
- **Step 4:** Under **Allowed Web Origins**, add your development and production domains.

### 5. Review & Submit National Exam Permission Letter
- **Step 1:** Open `docs/DRAFT_EAES_PERMISSION_LETTER.md`.
- **Step 2:** Review the proposed non-exclusive digital curation and accessibility terms with legal or administrative advisors.
- **Step 3:** Insert the official legal entity name, contact information, and date.
- **Step 4:** Print on official letterhead or dispatch via formal correspondence to the Educational Assessment and Examination Service (EAES) and Ministry of Education (MoE), Addis Ababa, Ethiopia.
- **Step 5:** Once acknowledged or granted, update `docs/CONTENT_RIGHTS.md` with the official permission reference number.
