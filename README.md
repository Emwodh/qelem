<div align="center">

# Qelem (ቀለም) — National Examination Platform

**Ethiopian Matriculation & University Entrance Examination Preparation Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Auth0](https://img.shields.io/badge/Auth0-OIDC_/_OAuth2-EB5424?style=for-the-badge&logo=auth0&logoColor=white)](https://auth0.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Serwist_Service_Worker-4A154B?style=for-the-badge)](https://serwist.pages.dev/)

<p align="center">
  A high-fidelity examination simulator, adaptive study companion, and administrative exam suite designed for Ethiopian secondary school students (Grades 9–12) across Natural and Social Science streams.
</p>

[Explore Features](#key-features) • [System Architecture](#system-architecture) • [Getting Started](#getting-started) • [Environment Variables](#environment-variables) • [Testing](#testing--verification)

</div>

---

## Overview

**Qelem** is an end-to-end educational platform tailored to the Ethiopian national curriculum. It bridges the gap between traditional study materials and modern, adaptive digital learning by providing:

1. **A Timed Examination Simulator** that accurately mirrors the interface, pressure, and timing of official Ethiopian University Entrance Examinations (EUEE).
2. **Offline-Resilient Exam Delivery** built on progressive web application (PWA) standards, ensuring that fluctuating connectivity in regional test centers does not interrupt students' examination progress.
3. **Automated Exam Extraction** utilizing server-side PDF and document parsers that convert legacy paper examination archives into structured question banks with LaTeX mathematical formulas.
4. **Partitioned Administrative Operations** with strict physical separation between student examination spaces and administrative tooling (question management, payment verification, audit logging, and cohort analytics).

---

## Key Features

### 🎓 Student Experience
- **Timed National Exam Simulation**: Realistic mock examinations with countdown timers, persistent question state, question tagging/bookmarking, and heartbeat synchronization (`/api/exams/[id]/heartbeat`).
- **Comprehensive Grade 9–12 Question Bank**: Categorized across Natural Science (Mathematics, Physics, Chemistry, Biology) and Social Science (Mathematics, English, Aptitude, History, Geography, Economics, Civics).
- **STEM Formula Rendering**: Crisp mathematical and scientific typesetting via integrated KaTeX for complex equations, matrices, and notation.
- **Adaptive Performance Analytics**: Real-time readiness scoring, strengths and weakness breakdowns by topic, score projections, and detailed post-exam performance reports.
- **Mistakes Notebook & Spaced Review**: Automatically logs incorrectly answered questions for targeted remediation before official exam dates.
- **Offline PWA Support**: Powered by Serwist service workers, enabling offline question caching and resilient local state persistence.

### 🛡️ Administration & Examination Operations
- **Physical Portal Partitioning**: Zero administrative chrome, routes, or assets exposed to student clients. Admin consoles are completely isolated under the `/admin` boundary.
- **Automated Exam Paper Ingestion**: Upload past national examination papers (PDF/DOCX) via `/api/admin/parse-file` with automated text segmentation, option extraction, and answer key generation.
- **Localized Ethiopian Payment Processing**: Native workflows for Ethiopian payment methods (Telebirr, CBE Birr, Chapa, and manual receipt validation) with a specialized administrative review interface.
- **User & Access Management**: Role-based access control (RBAC) governing Students, Reviewers, Admins, and Superadmins, with enrollment expiration and access auditing.
- **Immutable Audit Logging**: Built-in audit trail tracking administrative actions, question updates, and verification decisions.

---

## System Architecture

```
                                  +-----------------------------+
                                  |     Student & Admin Web     |
                                  |  (Next.js 16 + React 19)    |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
         +---------------------------+                       +---------------------------+
         |     Student Portal        |                       |   Admin Management Suite  |
         |  - Exam Simulator         |                       |  - PDF Exam Parser        |
         |  - Practice & Analytics   |                       |  - Question Bank Admin    |
         |  - Mistakes Notebook      |                       |  - Payment Verification   |
         |  - Offline Service Worker |                       |  - User RBAC & Audit Logs |
         +-------------+-------------+                       +-------------+-------------+
                       |                                                   |
                       +-------------------------+-------------------------+
                                                 |
                                                 v
                                  +-----------------------------+
                                  |   Next.js App Router API    |
                                  |  (Route Handlers & Proxy)   |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
         +---------------------------+                       +---------------------------+
         |    Auth0 Identity Hub     |                       |    Supabase Data Layer    |
         |  - Universal Login        |                       |  - PostgreSQL Database    |
         |  - OIDC / PKCE Flows      |                       |  - Row Level Security     |
         |  - Role & Token Claims    |                       |  - SSR Server Client      |
         +---------------------------+                       +---------------------------+
```

---

## Tech Stack

| Domain | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | `16.3.8` | React Server Components, App Router, Turbopack builds |
| **Frontend Runtime** | [React](https://react.dev/) | `19.0.0` | Declarative UI layer, concurrent features |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.7.3` | End-to-end static typing and interface verification |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `3.4.17` | Utility-first, calibrated editorial design system |
| **Authentication** | [Auth0 Next.js SDK](https://auth0.com/docs) | `^4.33.0` | Enterprise OIDC/OAuth2 authentication, PKCE flows |
| **Database & Storage** | [Supabase](https://supabase.com/) | `^2.117.2` | Managed PostgreSQL with Row-Level Security (RLS) |
| **Offline & PWA** | [Serwist](https://serwist.pages.dev/) | `^9.5.12` | Service worker lifecycle, background caching |
| **Typesetting** | [KaTeX](https://katex.org/) | `^0.18.9` | High-performance LaTeX mathematical formula rendering |
| **Document Parsing** | [pdf-parse](https://www.npmjs.com/package/pdf-parse) | `^2.4.5` | Server-side national exam PDF question extraction |
| **Icons** | [Lucide React](https://lucide.dev/) | `^0.475.0` | Consistent, lightweight vector icon system |

---

## Project Structure

```
qelem/
├── public/                     # Static assets, manifests, and icons
│   ├── sw.js                   # Serwist Service Worker output
│   └── manifest.json           # Progressive Web Application manifest
├── scripts/
│   └── verify-auth0-integration.mjs # Integration test suite for Auth0 flows
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (dashboard)/        # Student experience (Dashboard, Bank, Mistakes, Analytics)
│   │   │   ├── analytics/      # Exam readiness metrics and score reports
│   │   │   ├── bank/           # Topic-indexed question bank
│   │   │   ├── dashboard/      # Student home dashboard
│   │   │   ├── mistakes/       # Spaced-repetition review notebook
│   │   │   ├── mock-exams/     # Official national exam simulations
│   │   │   └── study-plan/     # Adaptive university preparation schedules
│   │   ├── admin/              # Partitioned admin console
│   │   │   ├── analytics/      # Cohort performance and usage statistics
│   │   │   ├── payments/       # Telebirr / CBE / Chapa transaction review
│   │   │   ├── questions/      # Question bank editor and PDF ingestion
│   │   │   ├── settings/       # System preferences and platform parameters
│   │   │   └── users/          # RBAC directory and student entitlements
│   │   ├── api/                # Backend API route handlers
│   │   │   ├── admin/          # PDF ingestion, payment audits, verification
│   │   │   ├── exams/          # Exam start, heartbeat sync, and submission
│   │   │   └── payments/       # Payment webhook and manual receipt ingest
│   │   ├── practice/           # Full-screen distraction-free exam simulator
│   │   ├── layout.tsx          # Root layout wrapping Auth0Provider
│   │   └── proxy.ts            # Next.js request edge routing and proxies
│   ├── components/             # Modular UI components
│   │   ├── admin/              # Admin navigation, audit logs, and drawers
│   │   ├── billing/            # Ethiopian payment modals and receipts
│   │   ├── dashboard/          # Student navigation, progress bars, stats
│   │   ├── landing/            # Public editorial landing page and pricing
│   │   ├── practice/           # Question renderer, KaTeX formula blocks, timer
│   │   └── ui/                 # Reusable design tokens, buttons, dialogs
│   ├── lib/                    # Core business logic and database access
│   │   ├── auth0.ts            # Auth0 server client configuration
│   │   ├── auditStore.ts       # Administrative audit trail management
│   │   ├── questionStore.ts    # Question caching and query filters
│   │   ├── settingsStore.ts    # Application runtime configuration
│   │   ├── userStore.ts        # User progress and mock exam state
│   │   └── supabase/           # Supabase browser, server, and admin clients
│   └── types/                  # TypeScript interface definitions
├── .env.example                # Template for required environment variables
├── next.config.ts              # Next.js and Serwist compiler configuration
├── package.json                # Project dependencies and script declarations
└── tsconfig.json               # TypeScript strict configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later (LTS recommended)
- **Package Manager**: `npm` (v10+), `pnpm` (v9+), or `yarn` (v1.22+)
- **Supabase Project**: Free or Pro instance on [supabase.com](https://supabase.com)
- **Auth0 Tenant**: Free or Production tenant on [auth0.com](https://auth0.com)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Emwodh/qelem.git
   cd qelem
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a local environment file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Populate `.env.local` with your credentials (see [Environment Variables](#environment-variables)).

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Configure these keys in your `.env.local` (local development) or platform deployment settings (Vercel / Cloud Provider):

| Variable | Description | Example / Format | Required |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint URL of your Supabase project | `https://xyz.supabase.co` | **Yes** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key for client requests | `eyJh...` | **Yes** |
| `AUTH0_SECRET` | 32-byte hexadecimal secret for session cookie encryption | Generate with `openssl rand -hex 32` | **Yes** |
| `APP_BASE_URL` | Canonical root URL of the running application | `http://localhost:3000` or production domain | **Yes** |
| `AUTH0_DOMAIN` | Domain identifier of your Auth0 tenant | `qelem-auth.us.auth0.com` | **Yes** |
| `AUTH0_CLIENT_ID` | Client ID from your Auth0 Regular Web Application | `aB1c2D3e4F5...` | **Yes** |
| `AUTH0_CLIENT_SECRET` | Client Secret from your Auth0 Application | `sUpErS3cr3t...` | **Yes** |

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack enabled |
| `npm run build` | Compiles an optimized production build with Serwist service workers |
| `npm run start` | Boots the built production server |
| `npm run type-check` | Runs the TypeScript compiler (`tsc --noEmit`) to validate type contracts |
| `npm test` | Executes the Auth0 integration test suite and routing verifications |

---

## Testing & Verification

The repository includes automated verification suites checking authentication contracts, physical path segregation, and route protections:

```bash
# Run Auth0 flow and routing verification suite
npm test

# Run full TypeScript validation
npm run type-check
```

---

## Production Deployment

### Deploying to Vercel

1. Push your repository to GitHub (`main` branch).
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. In **Project Settings > Environment Variables**, input all variables from the [Environment Variables](#environment-variables) section.
4. Ensure your Auth0 Application settings whitelist the deployed Vercel domain:
   - **Allowed Callback URLs**: `https://your-domain.vercel.app/auth/callback`
   - **Allowed Logout URLs**: `https://your-domain.vercel.app`
   - **Allowed Web Origins**: `https://your-domain.vercel.app`

### Self-Hosted / Docker Build

To run in containerized environments:
```bash
npm run build
npm run start
```
Ensure your reverse proxy forwards headers (`x-forwarded-proto`, `x-forwarded-host`) so Auth0 redirects resolve correctly.

---

## Contributing & Development Workflow

We follow standard Git branching hygiene and Conventional Commits:

1. Create a feature branch: `git checkout -b feature/topic-name`
2. Commit with conventional prefixes:
   - `feat:` for new capabilities
   - `fix:` for bug fixes
   - `perf:` for performance optimizations
   - `refactor:` for architectural refinements
   - `docs:` for documentation updates
3. Verify test compliance before opening a PR:
   ```bash
   npm test && npm run type-check
   ```

---

## License

This project is proprietary and confidential. All rights reserved by the Qelem Development Team.
