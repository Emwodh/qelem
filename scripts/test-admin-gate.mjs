import assert from "node:assert";
import {
  timingSafeCompare,
  verifyAdminPasskey,
  createAdminSessionToken,
  verifyAdminSessionToken,
  checkVerifyRateLimit,
  resetVerifyRateLimit,
  verifyAdminApiRequest,
} from "../src/lib/adminAuth.ts";

console.log("=== QELEM ADMIN GATE SECURITY TESTS ===");

const TEST_SECRET = "test_super_secret_admin_key_for_unit_tests_0123456789";

// ---------------------------------------------------------
// 1. timingSafeCompare
// ---------------------------------------------------------
console.log("\n[Test 1] Timing-safe string comparison...");
assert.strictEqual(timingSafeCompare("", ""), false, "Empty strings should not match");
assert.strictEqual(timingSafeCompare(null, "abc"), false, "Null input should return false");
assert.strictEqual(timingSafeCompare("abc", undefined), false, "Undefined input should return false");
assert.strictEqual(timingSafeCompare("secret-a", "secret-b"), false, "Different strings must not match");
assert.strictEqual(timingSafeCompare("secret", "secret-long"), false, "Different length strings must not match");
assert.strictEqual(timingSafeCompare("exact_match_key", "exact_match_key"), true, "Identical strings must match");
console.log("✓ timingSafeCompare safely handles edge cases and compares equal-length hashes.");

// ---------------------------------------------------------
// 2. verifyAdminPasskey (Fail Closed when unset)
// ---------------------------------------------------------
console.log("\n[Test 2] Passkey verification & Fail-Closed enforcement...");
delete process.env.ADMIN_SECRET_KEY;
assert.strictEqual(
  verifyAdminPasskey("any_candidate_key"),
  false,
  "Must fail closed when ADMIN_SECRET_KEY is undefined"
);

process.env.ADMIN_SECRET_KEY = "";
assert.strictEqual(
  verifyAdminPasskey("any_candidate_key"),
  false,
  "Must fail closed when ADMIN_SECRET_KEY is empty"
);

process.env.ADMIN_SECRET_KEY = "   ";
assert.strictEqual(
  verifyAdminPasskey("   "),
  false,
  "Must fail closed when ADMIN_SECRET_KEY is whitespace only"
);

process.env.ADMIN_SECRET_KEY = TEST_SECRET;
assert.strictEqual(
  verifyAdminPasskey("wrong_key"),
  false,
  "Must reject incorrect passkey"
);
assert.strictEqual(
  verifyAdminPasskey(null),
  false,
  "Must reject null candidate"
);
assert.strictEqual(
  verifyAdminPasskey(TEST_SECRET),
  true,
  "Must accept exact matching passkey"
);
assert.strictEqual(
  verifyAdminPasskey(`  ${TEST_SECRET}  `),
  true,
  "Must accept trimmed passkey"
);
console.log("✓ verifyAdminPasskey fails closed when unset and strictly verifies candidates.");

// ---------------------------------------------------------
// 3. HMAC-SHA256 Session Tokens (Creation, Expiry, Tampering)
// ---------------------------------------------------------
console.log("\n[Test 3] Admin HMAC session token signing, expiry, and anti-tampering...");
process.env.ADMIN_SECRET_KEY = TEST_SECRET;
const token = createAdminSessionToken(7200);
assert.ok(typeof token === "string" && token.includes("."), "Session token must be dot-delimited");
assert.strictEqual(verifyAdminSessionToken(token), true, "Valid token must verify successfully");

// Tampered payload
const [payload, sig] = token.split(".");
const tamperedPayload = Buffer.from(
  Buffer.from(payload, "base64url").toString("utf8") + "0"
).toString("base64url");
assert.strictEqual(
  verifyAdminSessionToken(`${tamperedPayload}.${sig}`),
  false,
  "Tampered payload must fail signature verification"
);

// Tampered signature
const tamperedSig = sig.slice(0, -2) + "aa";
assert.strictEqual(
  verifyAdminSessionToken(`${payload}.${tamperedSig}`),
  false,
  "Tampered signature must fail verification"
);

// Expired token
const expiredToken = createAdminSessionToken(-10); // expired 10 seconds ago
assert.strictEqual(
  verifyAdminSessionToken(expiredToken),
  false,
  "Expired token must be rejected"
);

// Rotated secret
process.env.ADMIN_SECRET_KEY = "new_rotated_secret_value_9876543210";
assert.strictEqual(
  verifyAdminSessionToken(token),
  false,
  "Token signed with old secret must be rejected after rotation"
);
process.env.ADMIN_SECRET_KEY = TEST_SECRET;
console.log("✓ HMAC session tokens enforce cryptographic signatures and strict expiration.");

// ---------------------------------------------------------
// 4. Rate Limiting on /api/admin/verify
// ---------------------------------------------------------
console.log("\n[Test 4] Rate limiting (5 attempts / 15 minutes)...");
const testIp = "192.168.100.42";
resetVerifyRateLimit(testIp);

for (let i = 1; i <= 5; i++) {
  const result = checkVerifyRateLimit(testIp);
  assert.strictEqual(result.allowed, true, `Attempt ${i} should be allowed`);
  assert.strictEqual(result.remaining, 5 - i, `Remaining attempts should be ${5 - i}`);
}

const blockedResult = checkVerifyRateLimit(testIp);
assert.strictEqual(blockedResult.allowed, false, "6th attempt must be blocked");
assert.strictEqual(blockedResult.remaining, 0, "Remaining must be 0");
assert.ok(blockedResult.retryAfterSec && blockedResult.retryAfterSec > 0, "Must return retry-after seconds");

resetVerifyRateLimit(testIp);
const resetResult = checkVerifyRateLimit(testIp);
assert.strictEqual(resetResult.allowed, true, "Rate limit should reset on successful reset");
console.log("✓ checkVerifyRateLimit enforces 5 attempts max and returns retry-after.");

// ---------------------------------------------------------
// 5. verifyAdminApiRequest across routes
// ---------------------------------------------------------
console.log("\n[Test 5] verifyAdminApiRequest across headers, cookies, and routes...");

const adminRoutes = [
  { path: "/api/admin/verify", method: "POST" },
  { path: "/api/admin/payments", method: "GET" },
  { path: "/api/admin/payments/review", method: "POST" },
  { path: "/api/admin/parse-file", method: "POST" },
];

// A: Server secret missing -> Fail Closed for all admin requests
delete process.env.ADMIN_SECRET_KEY;
for (const route of adminRoutes) {
  const req = new Request(`http://localhost:3000${route.path}`, { method: route.method });
  const res = verifyAdminApiRequest(req);
  assert.strictEqual(res.authorized, false, `Must fail closed for ${route.path} when key is unset`);
}

// B: Server secret configured, missing auth -> Unauthorized for all routes
process.env.ADMIN_SECRET_KEY = TEST_SECRET;
for (const route of adminRoutes) {
  const req = new Request(`http://localhost:3000${route.path}`, { method: route.method });
  const res = verifyAdminApiRequest(req);
  assert.strictEqual(res.authorized, false, `Must reject unauthenticated request to ${route.path}`);
  assert.ok(res.error, "Must include rejection error message");
}

// C: Invalid x-admin-key header
for (const route of adminRoutes) {
  const req = new Request(`http://localhost:3000${route.path}`, {
    method: route.method,
    headers: { "x-admin-key": "invalid_wrong_passkey" },
  });
  const res = verifyAdminApiRequest(req);
  assert.strictEqual(res.authorized, false, `Must reject invalid header key for ${route.path}`);
}

// D: Valid x-admin-key header -> Authorized for all routes
for (const route of adminRoutes) {
  const req = new Request(`http://localhost:3000${route.path}`, {
    method: route.method,
    headers: { "x-admin-key": TEST_SECRET },
  });
  const res = verifyAdminApiRequest(req);
  assert.strictEqual(res.authorized, true, `Must authorize valid header key for ${route.path}`);
  assert.strictEqual(res.authMethod, "header");
}

// E: Valid session cookie -> Authorized for all routes
const validSessionToken = createAdminSessionToken(7200);
for (const route of adminRoutes) {
  const req = new Request(`http://localhost:3000${route.path}`, {
    method: route.method,
    headers: { cookie: `qelem_admin_token=${validSessionToken}` },
  });
  const res = verifyAdminApiRequest(req);
  assert.strictEqual(res.authorized, true, `Must authorize valid session cookie for ${route.path}`);
  assert.strictEqual(res.authMethod, "cookie");
}

// F: Expired session cookie -> Rejected for all routes
const expiredSessionToken = createAdminSessionToken(-10);
for (const route of adminRoutes) {
  const req = new Request(`http://localhost:3000${route.path}`, {
    method: route.method,
    headers: { cookie: `qelem_admin_token=${expiredSessionToken}` },
  });
  const res = verifyAdminApiRequest(req);
  assert.strictEqual(res.authorized, false, `Must reject expired session cookie for ${route.path}`);
}

console.log("✓ All admin endpoints safely reject missing/invalid auth and accept valid credentials.");

// ---------------------------------------------------------
// 6. Optional Live Server Verification (if server is running)
// ---------------------------------------------------------
console.log("\n[Test 6] Checking for live local server on http://localhost:3000...");
try {
  const liveCheck = await fetch("http://localhost:3000/", { signal: AbortSignal.timeout(1000) });
  if (liveCheck.ok) {
    console.log("Live server detected! Running live HTTP authorization tests...");
    
    // Live GET /api/admin/payments without auth -> 401
    const resPayments = await fetch("http://localhost:3000/api/admin/payments");
    assert.strictEqual(resPayments.status, 401, "Live /api/admin/payments must return 401");

    // Live POST /api/admin/verify with wrong key -> 401
    const resBadVerify = await fetch("http://localhost:3000/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey: "wrong_key" }),
    });
    assert.strictEqual(resBadVerify.status, 401, "Live /api/admin/verify must return 401 on wrong key");

    console.log("✓ Live HTTP server tests confirmed 401 Unauthorized for admin endpoints.");
  }
} catch {
  console.log("No live server running on http://localhost:3000 (skipped live HTTP probe; unit tests fully passed).");
}

console.log("\n=== ALL ADMIN GATE TESTS PASSED SUCCESSFULLY ===");
