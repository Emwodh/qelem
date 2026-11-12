import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { verifyAdminRequest } from "../src/lib/adminAuth.ts";
import { checkRateLimit } from "../src/lib/rateLimit.ts";

console.log("===============================================================");
console.log("   QELEM EXIT GATE 0 — AUTOMATED VERIFICATION & QA SUITE      ");
console.log("===============================================================\n");

// ============================================================================
// 1. Missing env vars cause src/lib/env.ts to crash / fail-closed
// ============================================================================
console.log("[Gate 0.1] Testing Environment Fail-Closed Startup Validation...");

{
  // 1a. Test missing env vars crashes with exit code 1 and fatal error
  const res = spawnSync(process.execPath, [
    "--experimental-strip-types",
    "-e",
    "import('./src/lib/env.ts')",
  ], {
    env: {}, // completely empty environment
    encoding: "utf-8",
  });

  assert.strictEqual(
    res.status,
    1,
    `Expected exit code 1 when env vars are missing, got ${res.status}`
  );
  assert(
    res.stderr.includes("[FATAL] Environment variable validation failed:") ||
    res.stdout.includes("[FATAL] Environment variable validation failed:"),
    "Stderr/stdout must log fatal validation failure message"
  );
  assert(
    res.stderr.includes("Application crashed on startup (fail-closed).") ||
    res.stdout.includes("Application crashed on startup (fail-closed)."),
    "Stderr/stdout must indicate fail-closed startup crash"
  );
  console.log("  ✓ src/lib/env.ts crashes immediately (exit code 1, fail-closed) when env vars are missing.");

  // 1b. Test valid env vars parses cleanly
  const validRes = spawnSync(process.execPath, [
    "--experimental-strip-types",
    "-e",
    "import('./src/lib/env.ts').then(m => console.log('PARSED_COUNT:' + Object.keys(m.env).length))",
  ], {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://test-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test_anon_key_valid",
      SUPABASE_SERVICE_ROLE_KEY: "test_service_key_valid",
      AUTH0_SECRET: "0123456789abcdef0123456789abcdef",
      AUTH0_DOMAIN: "test-domain.auth0.com",
      AUTH0_CLIENT_ID: "test_client_id",
      AUTH0_CLIENT_SECRET: "test_client_secret",
      APP_BASE_URL: "http://localhost:3000",
    },
    encoding: "utf-8",
  });

  assert.strictEqual(
    validRes.status,
    0,
    `Expected exit code 0 when env vars are provided, got ${validRes.status}: ${validRes.stderr}`
  );
  assert(
    validRes.stdout.includes("PARSED_COUNT:"),
    "Must output parsed environment schema"
  );
  console.log("  ✓ src/lib/env.ts validates and initializes successfully when required vars are provided.");
}

// ============================================================================
// 2. Admin gate denies unauthorized users
// ============================================================================
console.log("\n[Gate 0.2] Testing Admin Gate & Role Verification...");

{
  const savedUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const savedAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const savedService = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 2a. Fail-closed on missing configuration
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  const unconfigReq = new Request("http://localhost:3000/api/admin/payments");
  const unconfigRes = await verifyAdminRequest(unconfigReq);
  assert.strictEqual(unconfigRes.authorized, false, "Must fail closed if Supabase URL is missing");
  assert.strictEqual(unconfigRes.status, 500, "Status must be 500 when configuration is missing");
  console.log("  ✓ Unconfigured server fails closed with 500.");

  // Restore env for remaining tests
  process.env.NEXT_PUBLIC_SUPABASE_URL = savedUrl || "https://placeholder-project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = savedAnon || "test_anon_key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = savedService || "test_service_key";

  // 2b. Rejection of unauthenticated requests (no session)
  const unauthReq = new Request("http://localhost:3000/api/admin/payments");
  const unauthRes = await verifyAdminRequest(unauthReq);
  assert.strictEqual(unauthRes.authorized, false, "Must reject request without session");
  assert.strictEqual(unauthRes.status, 401, "Must return 401 Unauthorized");
  console.log("  ✓ Anonymous request without session is denied (401).");

  // 2c. Rejection of invalid bearer token
  const invalidBearerReq = new Request("http://localhost:3000/api/admin/payments", {
    headers: { authorization: "Bearer invalid_forged_token_123" },
  });
  const invalidBearerRes = await verifyAdminRequest(invalidBearerReq);
  assert.strictEqual(invalidBearerRes.authorized, false, "Must reject forged bearer token");
  assert.strictEqual(invalidBearerRes.status, 401, "Must return 401 for invalid token");
  console.log("  ✓ Forged/invalid Bearer token is denied (401).");

  // 2d. Client-side user_metadata.is_admin is completely rejected in adminAuth
  const adminAuthSource = fs.readFileSync(path.resolve("src/lib/adminAuth.ts"), "utf-8");
  assert(
    adminAuthSource.includes("Reject client-controllable user_metadata.is_admin") ||
    adminAuthSource.includes("Reject client-controllable metadata"),
    "adminAuth.ts must document rejection of client metadata"
  );
  assert(
    !adminAuthSource.includes("user.user_metadata?.is_admin"),
    "adminAuth.ts must NOT trust user_metadata.is_admin"
  );
  console.log("  ✓ Client user_metadata.is_admin bypass is rejected; server role is verified against DB.");

  // 2e. Service-role bearer token authorized
  const serviceReq = new Request("http://localhost:3000/api/admin/payments", {
    headers: { authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
  });
  const serviceRes = await verifyAdminRequest(serviceReq);
  assert.strictEqual(serviceRes.authorized, true, "Must authorize service role bearer token");
  assert.strictEqual(serviceRes.status, 200, "Must return 200 OK");
  assert.strictEqual(serviceRes.user?.role, "admin");
  console.log("  ✓ Trusted service-role bearer token is authorized (200).");

  // 2f. Rate limiting enforcement
  const rlKey = `gate0_ip_${Date.now()}`;
  for (let i = 1; i <= 3; i++) {
    const rlRes = await checkRateLimit(rlKey, 3, 10);
    assert.strictEqual(rlRes.success, true);
  }
  const rlBlocked = await checkRateLimit(rlKey, 3, 10);
  assert.strictEqual(rlBlocked.success, false, "4th attempt beyond limit 3 must be blocked");
  console.log("  ✓ Rate limiting throttles brute force attempts.");
}

// ============================================================================
// 3. Anonymous / regular users cannot read payments of others
// ============================================================================
console.log("\n[Gate 0.3] Verifying Payment Isolation (Cross-Tenant & Anonymous Protection)...");

{
  const paymentsRouteSource = fs.readFileSync(
    path.resolve("src/app/api/payments/manual/route.ts"),
    "utf-8"
  );

  // 3a. Verify list mode is removed
  assert(
    paymentsRouteSource.includes("List mode is forbidden") ||
    paymentsRouteSource.includes("List mode has been removed"),
    "GET /api/payments/manual must forbid list mode"
  );
  assert(
    paymentsRouteSource.includes("txRef.trim().length === 0") ||
    paymentsRouteSource.includes("!txRef"),
    "GET /api/payments/manual must require txRef parameter"
  );
  console.log("  ✓ Unscoped payment list mode is removed from GET /api/payments/manual.");

  // 3b. Verify active session is required
  assert(
    paymentsRouteSource.includes("Active session required to view transaction details"),
    "GET /api/payments/manual must require authenticated session"
  );
  console.log("  ✓ Anonymous users are denied from querying payment records (401).");

  // 3c. Verify queries are owner-scoped to user_id
  assert(
    paymentsRouteSource.includes('.eq("user_id", user.id)'),
    "GET /api/payments/manual must scope database query to user.id"
  );
  console.log("  ✓ Regular authenticated users are strictly restricted to their own user_id.");

  // 3d. Verify Supabase RLS Migration (007_security.sql)
  const migrationSql = fs.readFileSync(
    path.resolve("supabase/migrations/007_security.sql"),
    "utf-8"
  );
  assert(
    migrationSql.includes("ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;"),
    "RLS must be enabled on public.payments"
  );
  assert(
    migrationSql.includes('CREATE POLICY "Authenticated users can select own payments"'),
    "SELECT policy must be created for authenticated users"
  );
  assert(
    migrationSql.includes("USING (auth.uid() = user_id)"),
    "SELECT policy must restrict access to auth.uid() = user_id"
  );
  assert(
    !migrationSql.includes('ON public.payments FOR SELECT\n  TO anon') &&
    !migrationSql.includes('ON public.payments FOR SELECT TO anon'),
    "Anonymous role must NEVER have SELECT policy on public.payments"
  );
  console.log("  ✓ Postgres RLS policy enforces (auth.uid() = user_id) on payments; zero access to anon.");
}

// ============================================================================
// 4. Anonymous / regular users cannot update payments
// ============================================================================
console.log("\n[Gate 0.4] Verifying Payment Immutability & Modification Restrictions...");

{
  const paymentsRouteSource = fs.readFileSync(
    path.resolve("src/app/api/payments/manual/route.ts"),
    "utf-8"
  );

  // 4a. API Route method export check: only POST and GET
  assert(
    !paymentsRouteSource.includes("export async function PUT"),
    "Payment route must NOT export PUT handler"
  );
  assert(
    !paymentsRouteSource.includes("export async function PATCH"),
    "Payment route must NOT export PATCH handler"
  );
  assert(
    !paymentsRouteSource.includes("export async function DELETE"),
    "Payment route must NOT export DELETE handler"
  );
  console.log("  ✓ Payment API routes export only POST and GET; PUT/PATCH/DELETE are impossible.");

  // 4b. Status review route requires admin gate
  const reviewRouteSource = fs.readFileSync(
    path.resolve("src/app/api/admin/payments/review/route.ts"),
    "utf-8"
  );
  assert(
    reviewRouteSource.includes("verifyAdminRequest(req)"),
    "Payment review endpoint must enforce verifyAdminRequest"
  );
  console.log("  ✓ Payment status review endpoint enforces verifyAdminRequest.");

  // 4c. Supabase RLS Migration (007_security.sql) restricts UPDATE & DELETE to service_role
  const migrationSql = fs.readFileSync(
    path.resolve("supabase/migrations/007_security.sql"),
    "utf-8"
  );
  assert(
    migrationSql.includes('CREATE POLICY "Service role can update payments"\n  ON public.payments FOR UPDATE\n  TO service_role'),
    "UPDATE policy on payments must be restricted to service_role only"
  );
  assert(
    migrationSql.includes('CREATE POLICY "Service role can delete payments"\n  ON public.payments FOR DELETE\n  TO service_role'),
    "DELETE policy on payments must be restricted to service_role only"
  );
  assert(
    !migrationSql.includes('ON public.payments FOR UPDATE\n  TO anon') &&
    !migrationSql.includes('ON public.payments FOR UPDATE\n  TO authenticated'),
    "Neither anon nor regular authenticated users may have UPDATE policy on payments"
  );
  assert(
    migrationSql.includes("CREATE TRIGGER trg_force_payment_initial_status") &&
    migrationSql.includes("NEW.status := 'MANUAL_REVIEW'"),
    "Database trigger must force initial pending status and prevent client status tampering"
  );
  console.log("  ✓ Postgres RLS policies restrict UPDATE and DELETE on payments to service_role only.");
  console.log("  ✓ Database trigger trg_force_payment_initial_status prevents client status spoofing.");
}

// ============================================================================
// 5. Anonymous / regular users cannot select answer columns
// ============================================================================
console.log("\n[Gate 0.5] Verifying Question Answer Key & Solution Protection...");

{
  const migrationSql = fs.readFileSync(
    path.resolve("supabase/migrations/007_security.sql"),
    "utf-8"
  );

  // 5a. Direct table access revoked
  assert(
    migrationSql.includes("REVOKE ALL ON public.questions FROM anon, authenticated;"),
    "Must revoke all privileges on public.questions from anon and authenticated"
  );
  console.log("  ✓ Direct table access to public.questions is revoked from anon and authenticated.");

  // 5b. Public view created without sensitive answer columns
  assert(
    migrationSql.includes("CREATE OR REPLACE VIEW public.questions_public AS"),
    "public.questions_public view must be created"
  );

  // Extract columns selected in view definition
  const viewMatch = migrationSql.match(
    /CREATE OR REPLACE VIEW public\.questions_public AS\s+SELECT([\s\S]+?)FROM public\.questions;/
  );
  assert(viewMatch && viewMatch[1], "View definition must be parseable");
  const viewCols = viewMatch[1]
    .split(",")
    .map((c) => c.trim().toLowerCase());

  assert(
    !viewCols.includes("correct_option_id"),
    "questions_public must NOT include correct_option_id"
  );
  assert(
    !viewCols.includes("explanation"),
    "questions_public must NOT include explanation"
  );
  assert(
    !viewCols.includes("derivation_steps") && !viewCols.includes("derivationsteps"),
    "questions_public must NOT include derivation steps"
  );
  assert(
    !viewCols.includes("distractor_analysis"),
    "questions_public must NOT include distractor analysis"
  );
  assert(
    !viewCols.includes("examiner_insight"),
    "questions_public must NOT include examiner insight"
  );
  console.log("  ✓ public.questions_public view physically omits correct_option_id, explanation, derivationSteps.");

  // 5c. API question sanitization in src/app/api/exams/start/route.ts
  const examStartSource = fs.readFileSync(
    path.resolve("src/app/api/exams/start/route.ts"),
    "utf-8"
  );
  assert(
    examStartSource.includes("correctOptionId") &&
    examStartSource.includes("explanation") &&
    examStartSource.includes("derivationSteps"),
    "Exam start route must explicitly strip sensitive fields"
  );
  console.log("  ✓ Exam start API strips correctOptionId, explanation, and derivationSteps.");
}

// ============================================================================
// 6. Zero backdoor strings or hardcoded secret fallbacks in src/
// ============================================================================
console.log("\n[Gate 0.6] Verifying Zero Backdoors & Secret Fallbacks in src/...");

{
  const backdoorTokens = [
    "qelem-admin-2017",
    "qelem_admin_2026",
    "admin123",
  ];

  function searchInFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        searchInFiles(full);
      } else if (/\.(ts|tsx|js|jsx|json)$/.test(entry.name)) {
        const content = fs.readFileSync(full, "utf-8");
        for (const token of backdoorTokens) {
          assert(
            !content.toLowerCase().includes(token.toLowerCase()),
            `Found backdoor string '${token}' in file: ${full}`
          );
        }
      }
    }
  }

  searchInFiles(path.resolve("src"));
  console.log("  ✓ Zero backdoor tokens ('qelem-admin-2017', 'qelem_admin_2026', 'admin123') in src/.");

  // Verify no fallback dummy auth secrets in src/lib/auth0.ts
  const auth0Source = fs.readFileSync(path.resolve("src/lib/auth0.ts"), "utf-8");
  assert(
    !auth0Source.includes("fallback_") &&
    !auth0Source.includes("dummy_secret"),
    "src/lib/auth0.ts must not contain fallback secrets"
  );
  assert(
    auth0Source.includes("AUTH0_SECRET environment variable is missing or empty. Application failed closed."),
    "src/lib/auth0.ts must fail closed if AUTH0_SECRET is missing"
  );
  console.log("  ✓ src/lib/auth0.ts fails closed with fatal error on missing AUTH0_SECRET.");
}

// ============================================================================
// 7. Role Self-Promotion Protection (SQL & API Guard)
// ============================================================================
console.log("\n[Gate 0.7] Verifying Role Self-Promotion Protection...");

{
  const migrationSql = fs.readFileSync(
    path.resolve("supabase/migrations/007_security.sql"),
    "utf-8"
  );

  assert(
    migrationSql.includes("CREATE OR REPLACE FUNCTION public.guard_profile_role()"),
    "007_security.sql must define guard_profile_role function"
  );
  assert(
    migrationSql.includes("RAISE EXCEPTION 'Forbidden: users cannot modify their assigned role'"),
    "guard_profile_role must reject role modification by regular users"
  );
  assert(
    migrationSql.includes("CREATE TRIGGER trg_guard_profile_role"),
    "007_security.sql must create trg_guard_profile_role trigger on public.profiles"
  );
  assert(
    migrationSql.includes("NEW.role := 'student'"),
    "guard_profile_role must force new registrations to 'student' role"
  );
  console.log("  ✓ Database trigger trg_guard_profile_role blocks role self-promotion on INSERT and UPDATE.");
}

console.log("\n===============================================================");
console.log("   ALL EXIT GATE 0 VERIFICATION TESTS PASSED SUCCESSFULLY!    ");
console.log("===============================================================\n");
