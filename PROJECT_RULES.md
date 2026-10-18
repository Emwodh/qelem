# Antigravity Agent Directives & Architecture Standards (`PROJECT_RULES.md`)

## 1. Operating Rules & Workflow Protocol
- **Plan First**: Never modify code immediately. Before modifying or creating files, generate an **Implementation Plan Artifact** detailing:
  1. Root cause or feature breakdown.
  2. Exact files to be created, modified, or deleted.
  3. Potential edge cases or regression risks.
- **Verification Mandatory**:
  - Always run local type-checks (`npm run type-check` or `tsc --noEmit`) and linter checks (`npm run lint`) after modifications.
  - Before declaring a UI task complete, use the integrated browser to navigate the affected route, verify responsive rendering, and capture screenshots/run artifacts.
- **Atomic Commits & Minimal Diffs**: Only touch files relevant to the active task. Do not refactor unrelated modules or reformat untouched files.

---

## 2. Technical Stack & Conventions
- **Framework**: Next.js (App Router, React 19 / Server Components by default).
- **Styling**: Tailwind CSS.
  - Rely on semantic design tokens and smooth, rounded radii (`rounded-xl`, `rounded-2xl`).
  - Dark mode support using `class` strategy with consistent neutral contrast.
- **Language**: Strict TypeScript.
  - No `any` types. Provide explicit types or interfaces for API responses and component props.
  - Shared types live strictly in `/types` or `/lib/types`.
- **State Management**:
  - URL state (search params) for filters, sorting, and pagination.
  - React Context / Zustand only for global client state (e.g., auth session, user preferences).
  - React Query / Server Actions for data mutations and server cache invalidation.

---

## 3. Directory Structure & File Hierarchy
Keep the codebase modular and cleanly decoupled:

src/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── (auth)/           # Authentication route group
│   ├── (dashboard)/      # Protected platform views
│   └── api/              # Minimal REST/Webhook endpoints
├── components/           # Reusable UI primitives
│   ├── ui/               # Base headless/styled tokens (buttons, modals, inputs)
│   └── platform/         # Feature-specific composite components
├── hooks/                # Custom React client hooks
├── lib/                  # Utilities, DB clients, and validation schemas (Zod)
├── server/               # Server-only logic, data queries, and mutations
└── types/                # Global TypeScript definitions


---

## 4. API & Data Handling Rules
- **Validation**: All incoming data (Server Actions, API route bodies, search params) must be validated via **Zod** schemas.
- **Error Handling**:
  - Never let unhandled server crashes surface to the user.
  - Use structured error responses `{ success: false, error: { message: string, code: string } }`.
  - Provide fallback/empty states (`Skeleton`, `EmptyPlaceholder`) for all asynchronous UI loads.
- **Security & Secrets**:
  - Never hardcode API keys, secrets, or tokens. Use `process.env`.
  - Client-side code must never import server-side DB clients or private keys.

---

## 5. Artifact & Deliverable Standards
When concluding a task, always summarize:
1. Summary of changes made (files touched, packages added).
2. Status of type-checks, tests, and build scripts.
3. Instructions for running or testing the feature locally.