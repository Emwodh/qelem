import assert from "node:assert";
import {
  verifyAdminRequest,
} from "../src/lib/adminAuth.ts";
import { checkRateLimit } from "../src/lib/rateLimit.ts";

console.log("=== QELEM HARDENED ADMIN GATE & SECURITY TESTS ===");

// ---------------------------------------------------------
// 1. Fail Closed on missing Supabase configuration
// ---------------------------------------------------------
console.log("\n[Test 1] Fail-closed enforcement on missing configuration...");
const savedUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const savedAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const savedService = process.env.SUPABASE_SERVICE_ROLE_KEY;

delete process.env.NEXT_PUBLIC_SUPABASE_URL;
const unconfigReq = new Request("http://localhost:3000/api/admin/payments");
const unconfigRes = await verifyAdminRequest(unconfigReq);
assert.strictEqual(unconfigRes.authorized, false, "Must fail closed if Supabase URL is missing");
assert.strictEqual(unconfigRes.status, 500, "Status must be 500 when configuration is missing");

process.env.NEXT_PUBLIC_SUPABASE_URL = savedUrl || "https://placeholder-project.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = savedAnon || "test_anon_key";
process.env.SUPABASE_SERVICE_ROLE_KEY = savedService || "test_service_key";
console.log("✓ Admin gate fails closed (500) if configuration is missing.");

// ---------------------------------------------------------
// 2. Reject unauthenticated requests (no session / no cookies)
// ---------------------------------------------------------
console.log("\n[Test 2] Rejection of unauthenticated requests...");
const unauthReq = new Request("http://localhost:3000/api/admin/payments");
const unauthRes = await verifyAdminRequest(unauthReq);
assert.strictEqual(unauthRes.authorized, false, "Must reject request without session");
assert.strictEqual(unauthRes.status, 401, "Must return 401 Unauthorized");
assert.ok(unauthRes.error, "Must include rejection error message");
console.log("✓ Unauthenticated requests safely return 401 Unauthorized.");

// ---------------------------------------------------------
// 3. Service role internal token authorization
// ---------------------------------------------------------
console.log("\n[Test 3] Trusted service-role internal token verification...");
const serviceReq = new Request("http://localhost:3000/api/admin/payments", {
  headers: {
    authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  },
});
const serviceRes = await verifyAdminRequest(serviceReq);
assert.strictEqual(serviceRes.authorized, true, "Must authorize service role bearer token");
assert.strictEqual(serviceRes.status, 200, "Must return 200 OK");
assert.strictEqual(serviceRes.user?.role, "admin", "Must assign admin role to service-role caller");
console.log("✓ Service-role bearer tokens verify correctly for internal tooling.");

// ---------------------------------------------------------
// 4. Rate Limiting Tests
// ---------------------------------------------------------
console.log("\n[Test 4] Rate limiting enforcement (in-memory token bucket)...");
const testKey = `test_ip_${Date.now()}`;

for (let i = 1; i <= 5; i++) {
  const result = await checkRateLimit(testKey, 5, 10);
  assert.strictEqual(result.success, true, `Attempt ${i} should be allowed`);
}

const blocked = await checkRateLimit(testKey, 5, 10);
assert.strictEqual(blocked.success, false, "6th attempt beyond limit 5 must be blocked");
assert.strictEqual(blocked.remaining, 0, "Remaining tokens must be 0");
console.log("✓ Rate limiting safely blocks requests exceeding limit.");

console.log("\n=== ALL HARDENED ADMIN GATE TESTS PASSED SUCCESSFULLY ===");
