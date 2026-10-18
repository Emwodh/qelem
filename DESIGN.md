# Brand & Design System Specification (`DESIGN.md`)

## 1. Brand Philosophy & Aesthetic Direction
- **Identity Essence**: High-utility prosumer SaaS meets focused academic discipline. Calm, authoritative, and frictionless.
- **The Modern SaaS Standard**:
  - Dark-mode first with deep, rich neutrals (avoid pure pitch `#000000` for cards; rely on layered slate/zinc tones).
  - Subtle 1px borders (`border-white/[0.08]` or `border-neutral-200`) instead of heavy, drop shadows.
  - Soft, generous corner radii (`rounded-2xl` and `rounded-3xl`) to eliminate sharp, aggressive points and establish an approachable, tactile feel.
  - Generous optical padding and balanced negative space to keep high-density academic information scannable.

---

## 2. Color Palette & Token Architecture

### Primary Accent (Electric Indigo / Sapphire)
Conveys academic authority and sharp computational speed.
- `accent-500`: `#4F46E5` (Primary Interactive Actions, Active Tabs)
- `accent-400`: `#6366F1` (Hover States, Dark Mode Highlights)
- `accent-500/10`: Subtle glow backdrops and active selection badges.

### Surface & Background Tokens
Layered depth using high-precision zinc neutrals:
- **Canvas Base**: `#090A0F` (Deep void background)
- **Card Surface / Containers**: `#11131B` (Layer 1 elevation)
- **Nested Card / Inset Surface**: `#181A24` (Layer 2 elevation - question blocks, inputs)
- **Border Subtle**: `rgba(255, 255, 255, 0.08)` (Crisp divider lines)
- **Border Highlight**: `rgba(255, 255, 255, 0.16)` (Hover state borders)

### Feedback & Status Tokens
- **Mastery / Verified**: `#10B981` (Emerald — correct answers, high readiness score)
- **Needs Review / Warning**: `#F59E0B` (Amber — borderline topics, exam timer warnings)
- **Weak Spot / Critical**: `#EF4444` (Crimson — low diagnostic score, incorrect choices)

---

## 3. Typography Hierarchy
Prioritize a clean, grotesque geometric sans-serif (e.g., `Inter`, `Geist`, or `Plus Jakarta Sans`) paired with a tabular mono font for formulas, timers, and data tables.

| Role | Tailwind Class | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- |
| **Display Hero** | `text-4xl sm:text-6xl font-extrabold tracking-tight` | `-0.03em` | Primary Hero headlines |
| **Section Title** | `text-2xl sm:text-3xl font-bold tracking-tight` | `-0.02em` | Major module headers |
| **Card Header** | `text-lg sm:text-xl font-semibold` | `-0.01em` | Subject cards, stats blocks |
| **Body Primary** | `text-sm sm:text-base text-neutral-300 font-normal leading-relaxed` | `normal` | Explanations, summaries |
| **Metrics / Timers** | `font-mono text-xs sm:text-sm font-medium tracking-wide` | `0.02em` | Exam timers, readiness % |

---

## 4. UI Components & Micro-Interactions

### A. Surface Containers & Cards
- **Geometry**: `rounded-2xl` on cards; `rounded-3xl` on major hero banners or modal overlays.
- **Glassmorphism**: When stacking over subtle radial background glows, use:
  `bg-[#11131B]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.12)]`
- **Hover Micro-Interaction**:
  `transition-all duration-200 ease-out hover:border-white/[0.18] hover:-translate-y-0.5`

### B. Interactive Buttons & CTAs
- **Primary CTA**:
  `h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-[0_0_20px_rgba(79,70,229,0.35)] transition-all active:scale-[0.98]`
- **Secondary Ghost / Outline**:
  `h-11 px-6 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-neutral-200 font-medium transition-all`
- **Stream Pills / Grade Badges**:
  `px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/20 bg-indigo-500/10 text-indigo-300`

### C. Visual Motifs
- **Bookmark & Milestone Accents**: Soft ribbon or bookmark indicators marking completed units and bookmarked past questions.
- **Gradients**: Subtle radial gradients positioned off-center in the background to add ambient atmosphere without distracting from reading flow:
  `bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.15),rgba(255,255,255,0))]`

---

## 5. Rules for the AI Agent
1. **Never use standard harsh gray borders** like `#e5e7eb` or `border-neutral-500`. Always use alpha-blended tokens (`border-white/[0.08]` or `border-black/[0.08]`).
2. **Preserve High Readability**: Contrast ratios for educational text and question prompts must meet WCAG AAA standards.
3. **No Sharp Arrowhead Accents**: Use smooth, rounded chevron icons (`strokeWidth={2}` with rounded caps) for all pagination and dropdown elements.
4. **Data Density**: Balance white space with information density—students need to compare subjects and track scores without excessive scrolling.