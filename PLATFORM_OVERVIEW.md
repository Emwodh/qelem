# Qelem (ቀለም) — Platform Architecture, Engineering History & Product Roadmap

> **The Premier Ethiopian University Entrance Examination (EUEE) Preparation & Curriculum Mastery Engine (Grades 9–12)**

---

## 1. Executive Summary & Platform Identity

### What is Qelem?
**Qelem (ቀለም)** — meaning *ink*, *color*, and colloquially *education/learning* in Amharic — is a specialized, studio-crafted web platform engineered specifically for Ethiopian Grade 12 students preparing for the high-stakes national **Ethiopian University Entrance Examination (EUEE) / Matric Exam**, administered nationally by the Educational Assessment and Examinations Service (EAES / NEAEA).

### The Core Problem Solved
1. **Four-Year Curriculum Scope**: Unlike standard school finals that test a single academic term, the Ethiopian University Entrance Examination tests cumulative mastery across **all four high school years (Grades 9, 10, 11, and 12)**. Students typically lack a structured way to review foundational Grade 9 and 10 principles while keeping up with intensive Grade 12 coursework.
2. **Scattered Past Papers**: Past national papers (2005–2016 E.C.) circulate as messy scanned PDFs, incomplete photo copies, or disorganized Telegram channel messages lacking verified solutions.
3. **No Mathematical Derivations**: Most circulating answer keys provide only letter options (e.g., "1. B, 2. A") without showing step-by-step mathematical proofs, governing physical laws, or why distractors were designed to trap students.
4. **Lack of Exam Simulation**: Students sit for high-pressure 2-to-3 hour exams with 50 to 100 questions per subject without ever practicing under strict digital timers or experiencing calibrated pacing.
5. **Connectivity & Economic Constraints**: Ethiopian students often face intermittent internet access, power interruptions, and zero budget for expensive international subscription tools.

### The Solution Delivered by Qelem
Qelem solves these challenges through:
- **A Single Unified Revision Hub**: Curriculum-aligned question bank organized by Grade (9–12), Subject, Unit, and Exam Year.
- **KaTeX-Powered Formulas**: Every mathematical proof and scientific derivation is rendered crisply without layout shifts.
- **Multi-Format Ingestion**: Teachers and admins can copy-paste raw questions from Telegram channels or PDFs directly into a live parser that converts them into interactive questions.
- **Full Timed Mock Exam Simulator**: Distraction-free exam hall replicating official NEAEA entrance exams with countdown timers, question navigator grids, and local-first resilience (guaranteeing zero data loss if power cuts or network drops).
- **Zero-Budget Accessibility**: Designed to run entirely on free-tier infrastructure (Supabase Free PostgreSQL, Vercel/Next.js hosting, local client persistence) with no forced paywalls for students.

---

## 2. Chronological Project History: What You Asked & What Was Built

### Phase 1: Public Landing Page & Studio Design System
- **Your Request**: Scaffold an aesthetic, high-trust educational landing page for Ethiopian matric students. Establish a studio-crafted SaaS aesthetic inspired by Mobbin, Relume, and Linear (crisp light `#FAFAFA` canvas, 1px borders, `rounded-2xl`/`3xl`, bookmark branding, and no generic neon gradients).
- **What Was Built**:
  - Modular landing components in `src/components/landing/`: `Navbar`, `Hero`, `StreamSelector`, `Features`, and `Footer`.
  - Academic bookmark brand identity with Ethiopian script accent `Qelem [ቀለም]`.
  - Interactive stream switch between **Natural Science** (Maths, Physics, Chemistry, Biology) and **Social Science** (Maths, History, Geography, Economics).
  - High-impact metrics showcase (15,000+ Questions, 100% MoE Aligned, 10+ Years Past Papers).

### Phase 2: Visual Refinement & Contrast Polish
- **Your Request**: Polish the landing page to achieve top-tier prosumer contrast and depth.
- **What Was Built**:
  - Elevated browser stage preview with subtle background shading (`bg-neutral-100/70 p-4 sm:p-8 rounded-3xl border border-neutral-200/60`).
  - Browser card window with diffused shadow (`shadow-[0_20px_50px_rgba(0,0,0,0.06)]`).
  - Punchy curriculum progress meters with emerald, sapphire, and amber fills representing Grades 9 through 12.

### Phase 3: Core Interactive Practice Engine (`/practice`)
- **Your Request**: Build the interactive question workspace where students take a 10-question diagnostic readiness test.
- **What Was Built**:
  - TypeScript models in `src/types/curriculum.ts` and authentic seed dataset in `src/lib/mockQuestions.ts`.
  - Workspace with breadcrumbs, progress tracker, question cards, option selection, and instant feedback drawer.
  - End-of-test Diagnostic Summary screen calculating readiness score, predicted national percentile, and university admission recommendation.

### Phase 4: Candidate Session & Dashboard (`/dashboard`)
- **Your Request**: Build candidate profile persistence so diagnostic results flow into a candidate dashboard.
- **What Was Built**:
  - Client state store in `src/lib/userStore.ts` tracking user stream, target score, target university (e.g. AAU Faculty of Tech), and diagnostic history.
  - Personalized candidate dashboard displaying overall exam readiness gauge, Ethiopian matric countdown (Sene / ሰኔ), subject mastery breakdown, and personalized study roadmaps.

### Phase 5: Supabase Auth & PostgreSQL Database Setup
- **Your Request**: Upgrade client storage with a PostgreSQL database schema using Supabase.
- **What Was Built**:
  - Database migration `supabase/migrations/001_initial_schema.sql` creating `profiles` and `practice_sessions` tables with Row-Level Security (RLS).
  - Dual browser and server SSR clients in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` with graceful fallback when API keys are not yet configured.

### Phase 6: KaTeX Mathematical Engine & Question Bank Explorer (`/bank`)
- **Your Request**: Support formulas and equations across Physics and Mathematics, and build a curriculum question bank explorer.
- **What Was Built**:
  - `src/components/ui/MathRenderer.tsx` parsing inline equations (`$...$`) and display equations (`$$...$$`) safely using KaTeX.
  - Question Bank Explorer at `/bank` with multi-dimensional filtering by Subject, Grade (9, 10, 11, 12), Unit, and Exam Year.
  - Expandable accordion units and step-by-step solution drawers.

### Phase 7: Math Baseline Alignment & Tier Monetization Prototype
- **Your Request**: Fix KaTeX vertical alignment (inline formulas were sitting too high relative to plain text) and prototype study plan cheat sheets with Ethiopian payment rails (Chapa / telebirr).
- **What Was Built**:
  - Fixed KaTeX baseline alignment in `MathRenderer.tsx` using `align-baseline` and `leading-normal` wrapper rules.
  - Built High-Yield Study Plan Hub (`/study-plan`) with interactive cheat sheets, formula legends, and core laws.
  - Built Chapa checkout modal (`UpgradeModal.tsx`) showing Ethiopian payment methods (telebirr, CBE Birr, Awash Birr) at 499 ETB.

### Phase 8: Pixel-Perfect Visual Decluttering
- **Your Request**: "remove everything in read rectancgle" based on 2 uploaded screenshots.
- **What Was Built**:
  - Removed brand subtitle `Matric Prep (9–12)` from top Navbar.
  - Removed `15,000+ Qs` badge from the desktop Navbar link.
  - Removed trailing chevron `>` from hero announcement pill.
  - Removed fake browser address bar `[ 🔒 qelem.edu.et /matric/readiness ]` from the hero preview frame.
  - Removed cohort tag `• EUEE 2017 Cohort` from candidate information.
  - Removed explanatory subtitle under `Four-Year Curriculum Mastery (Grades 9–12)`.

### Phase 9 & 10: The Grill-Me Session & Complete Zero-Budget Functional Stack
- **Your Request**: In the interactive `/grill-me` session, you established the critical strategic direction:
  > *"I don't have money for anything so most things we make here should understand that there is no budget. I will have the subscription and all the things later, now let's focus on getting the questions and displaying them on the platform."*
- **What Was Built**:
  1. **Complete Removal of Payment Barriers**: All features, past papers, question banks, and mock exams were made 100% free and open to all registered students.
  2. **Simple Mandatory Authentication** (`/auth/login` and `/auth/register`):
     - Captured Candidate Name, Email/ID, Stream, Grade (9–12), Target University, and Password.
     - Linked to local storage and Supabase Auth with zero external fees.
  3. **Multi-Format Question Ingestion Portal** (`/admin/questions`):
     - Plain-text auto-parser: converts questions copied from Telegram or PDFs (`1. Prompt... A) ... B) ... Answer: B ... Explanation: ...`) into structured database records.
     - JSON array and CSV format support.
     - Live KaTeX preview rendering math equations in real time before saving.
  4. **Full-Length Timed Mock Exam Simulator** (`/mock-exams` and `/mock-exams/[examId]`):
     - Official past exam catalog (2014, 2015, 2016 E.C. Physics, Mathematics Natural, Chemistry, Biology).
     - Custom mock exam generator (choose subject, question count: 15/30/50 Qs, and timer: 30/60/120 mins).
     - Distraction-free test room with countdown timer, warning alerts (amber/red), question navigator grid (Answered / Flagged / Unanswered), and keyboard hotkeys (1-4, A-D, F, Arrows).
     - **Hybrid Local-First Resilience**: Automatically persists every selection and timer tick to browser `localStorage`, ensuring zero data loss if power fails, the tab is refreshed, or internet disconnects.
     - **Post-Exam Scorecard**: Detailed evaluation with accuracy %, national percentile projection, 4-year curriculum breakdown (Grades 9–12), and complete question-by-question KaTeX review.

---

## 3. Platform Architecture & Technical Stack

```
+--------------------------------------------------------------------------------+
|                                    CLIENT (BROWSER)                           |
|                                                                                |
|  [Next.js 15 App Router]                [State & Resilience]                  |
|  • Public Landing (/)                  • LocalStorage Mirroring               |
|  • Candidate Auth (/auth/*)             • Instant Answer Caching              |
|  • Question Bank (/bank)                • Timer Recovery                      |
|  • Study Plans (/study-plan)            • Offline Session Store               |
|  • Mock Exams Portal (/mock-exams)                                            |
|  • Test Room (/mock-exams/[examId])     [Presentation Layer]                  |
|  • Question Ingestion (/admin/questions) • KaTeX Math Rendering                |
|                                         • Lucide Icons / Studio CSS           |
+--------------------------------------------------------------------------------+
                                        │
                         HTTP REST / RPC│(Hybrid Offline-First)
                                        ▼
+--------------------------------------------------------------------------------+
|                             FREE TIER INFRASTRUCTURE                           |
|                                                                                |
|  [Vercel Serverless Hosting]           [Supabase Free Tier (PostgreSQL)]      |
|  • Edge routing & SSR                   • public.profiles                     |
|  • Dynamic API routes                   • public.practice_sessions            |
|  • Zero-cost static build               • public.questions (Indexed)          |
|                                         • Row Level Security (RLS)            |
+--------------------------------------------------------------------------------+
```

### Complete Route Inventory (11 Compiled Routes)

| Route Path | Type | Functionality & Scope |
| :--- | :--- | :--- |
| `/` | Static | Public landing page with hero preview, curriculum breakdown, and CTA routing. |
| `/_not-found` | Static | Custom 404 page styled with platform brand aesthetic. |
| `/auth/login` | Static | Candidate sign-in with email/student ID and password. |
| `/auth/register` | Static | Candidate registration with Stream (Natural/Social), Grade (9–12), and Target University. |
| `/dashboard` | Dynamic | Candidate command center with readiness index, matric countdown, and subject mastery. |
| `/practice` | Static | 10-question diagnostic readiness test with instant derivation drawer. |
| `/bank` | Static | Curriculum question bank explorer with Subject, Grade (9–12), Unit, and Year filters. |
| `/admin/questions` | Static | Multi-format question ingestion portal (plain text auto-parser, JSON, CSV, live KaTeX preview). |
| `/mock-exams` | Static | Timed mock exam catalog (Official 2014–2016 E.C. papers + custom mock generator). |
| `/mock-exams/[examId]` | Dynamic | Full-screen timed exam test room with question palette, local resilience, and scorecard. |
| `/study-plan` | Static | High-yield cheat sheets with essential formula legends and examiner trap alerts. |

---

## 4. Key Files & Codebase Map

### Core Configuration & Types
- [`src/types/curriculum.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/curriculum.ts): Interfaces for `ExamQuestion`, `QuestionOption`, `DistractorTrap`, `CurriculumUnit`, and `UnitCheatSheet`.
- [`src/types/user.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/user.ts): Interfaces for `UserProfile`, `ExamStream`, `GradeLevel (9-12)`, `SubjectMastery`, and database schemas.
- [`src/types/exam.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/types/exam.ts): Interfaces for `MockExamDefinition` and `MockExamAttempt`.

### Data Stores & Content Repositories
- [`src/lib/questionStore.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/questionStore.ts): Multi-format plain-text auto-parser, CSV parser, question querying, and local storage/Supabase persistence.
- [`src/lib/mockExamData.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/mockExamData.ts): Official past papers (2014–2016 E.C.) and exam attempt resilience management.
- [`src/lib/curriculumData.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/curriculumData.ts): Seed questions with KaTeX derivations and unit definitions.
- [`src/lib/cheatSheetData.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/cheatSheetData.ts): High-yield formula cheat sheets for Grades 11 and 12 Physics & Maths.
- [`src/lib/userStore.ts`](file:///c:/Users/emwod/Downloads/Qelem/src/lib/userStore.ts): Candidate authentication helpers, local profile storage, and Ethiopian matric countdown logic.

### Database Migrations
- [`supabase/migrations/001_initial_schema.sql`](file:///c:/Users/emwod/Downloads/Qelem/supabase/migrations/001_initial_schema.sql): PostgreSQL tables for `profiles` and `practice_sessions` with RLS.
- [`supabase/migrations/002_questions_schema.sql`](file:///c:/Users/emwod/Downloads/Qelem/supabase/migrations/002_questions_schema.sql): PostgreSQL table for `questions` with indexing across `subject`, `grade_level`, `exam_year`, and `unit`.

---

## 5. What Needed Special Attention & Lessons Learned

1. **Zero-Budget Realities**:
   - In student edtech (especially in emerging economies), forcing paywalls before establishing organic candidate trust causes immediate churn.
   - Removing payment restrictions turned Qelem from a gated commercial prototype into an immediately useful utility for real students.
   - All backend systems were architected to run permanently on free tiers (Supabase 500MB free PostgreSQL can hold over 300,000 text questions).

2. **Network Interruption & Local-First Resilience**:
   - In Ethiopia, internet drops and brief power cuts are common. A student taking a 2-hour 65-question exam cannot afford to lose answers on refresh.
   - *Solution*: Every answer click and timer second is written to `localStorage`. If the browser tab crashes or closes, the student re-opens the exam and immediately resumes from where they left off.

3. **Multi-Format Ingestion vs. Slow Manual Forms**:
   - Entering hundreds of past exam questions one field at a time (Prompt, Option A, Option B, etc.) is exhausting and impractical.
   - *Solution*: Built the plain-text auto-parser in `src/lib/questionStore.ts`. Admins can copy 20 questions directly from a Telegram channel, paste into `/admin/questions`, and watch them instantly parse and render with KaTeX math.

4. **KaTeX Formula Alignment**:
   - Initial inline KaTeX elements (`$...$`) floated slightly above the baseline of surrounding text.
   - *Solution*: Configured `align-baseline inline-block leading-normal` within `src/components/ui/MathRenderer.tsx`, creating smooth paragraph flow.

5. **Windows Process Port Management**:
   - When running continuous Next.js builds on Windows PowerShell, lingering Node processes on port 3000 can lock the port.
   - *Solution*: Always check and clean orphaned listener processes (`Get-NetTCPConnection -LocalPort 3000`) before starting new production daemon tasks.

---

## 6. Future Roadmap & Next Horizons

### Milestone A: Content Scaling (Thousands of Authentic Past Papers)
- [ ] Use `/admin/questions` to ingest full historical exams:
  - 2012–2016 E.C. Mathematics (Natural & Social)
  - 2012–2016 E.C. Physics, Chemistry, Biology
  - English Grammar & Reading Comprehension passages
  - Scholastic Aptitude Test (SAT / አጠቃላይ ብቃት) logic items
- [ ] Tag questions with Ministry of Education textbook chapter numbers.

### Milestone B: Telegram Mini-App / Bot Integration
- **Context**: In Ethiopia, Telegram is the primary mobile network layer due to low data consumption and zero-rated data packages offered by Ethio Telecom.
- [ ] Build a lightweight Qelem Telegram Bot (`@QelemMatricBot`):
  - Sends a "Daily Question of the Day" with KaTeX-rendered image solutions.
  - Allows students to take 10-question rapid sprints directly inside Telegram via a WebApp popup linking to `qelem.app/practice`.

### Milestone C: Optical Character Recognition (OCR) / PDF Question Scanner
- [ ] Integrate a free/open-source OCR pipeline (or lightweight client-side Tesseract.js / Gemini Flash free tier):
  - Students or teachers upload photo snapshots of paper exam booklets.
  - Automatically extracts the question prompt, four options, and converts mathematical symbols into KaTeX markdown.

### Milestone D: Offline Progressive Web App (PWA)
- [ ] Add Service Workers and Web App Manifest (`manifest.json`):
  - Enables Grade 12 students in regional areas without stable Wi-Fi to install Qelem to their Android home screens.
  - Cache the entire question bank locally using IndexedDB for 100% offline practice.

### Milestone E: Community Discussion & Peer Explanations
- [ ] Add a discussion thread under each question:
  - Students can post alternative derivation methods or ask for clarification.
  - Peer upvoting for the clearest conceptual explanation.

### Milestone F: Chapa Payment Activation (When Candidate Volume Scales)
- [ ] Once Qelem reaches substantial active candidates and the user is ready to monetize:
  - Re-enable the Chapa checkout flow in `src/components/billing/UpgradeModal.tsx`.
  - Hook live Chapa webhook to verify **telebirr** and **CBE Birr** mobile transactions to activate Pro features (e.g. video solutions, private teacher mentorship, or printable PDF mock packages).

---

## 7. How to Run, Test & Deploy the Platform

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start local Next.js development server
npm run dev

# 3. Open browser
http://localhost:3000
```

### Production Build & Verification
```bash
# 1. Verify TypeScript types
npx tsc --noEmit

# 2. Compile optimized production build
npm run build

# 3. Start production server
npm run start -- -p 3000
```

### Key URLs to Test in Browser
- **Homepage**: [`http://localhost:3000/`](http://localhost:3000/)
- **Registration**: [`http://localhost:3000/auth/register`](http://localhost:3000/auth/register)
- **Sign In**: [`http://localhost:3000/auth/login`](http://localhost:3000/auth/login)
- **Question Ingestion**: [`http://localhost:3000/admin/questions`](http://localhost:3000/admin/questions)
- **Question Bank**: [`http://localhost:3000/bank`](http://localhost:3000/bank)
- **Mock Exams Catalog**: [`http://localhost:3000/mock-exams`](http://localhost:3000/mock-exams)
- **Live Exam Test Room**: [`http://localhost:3000/mock-exams/euee-2016-physics`](http://localhost:3000/mock-exams/euee-2016-physics)
- **Study Plans**: [`http://localhost:3000/study-plan`](http://localhost:3000/study-plan)
- **Candidate Dashboard**: [`http://localhost:3000/dashboard`](http://localhost:3000/dashboard)

---
*Authored for the Qelem Project Repository — 2026. All rights reserved.*
