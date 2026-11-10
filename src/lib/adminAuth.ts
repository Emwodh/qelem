import crypto from "node:crypto";
import type { NextRequest } from "next/server";

// 1. In-Memory Rate Limiting for Admin Verification (5 attempts / 15 minutes per IP)
interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Rate limits admin verification requests by client IP.
 * Note: Uses in-memory storage; across multi-instance serverless functions,
 * rate limits apply per container instance.
 */
export function checkVerifyRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const cleanIp = ip || "unknown-client";
  const record = rateLimitMap.get(cleanIp);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(cleanIp, { attempts: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.attempts += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.attempts };
}

export function resetVerifyRateLimit(ip: string): void {
  rateLimitMap.delete(ip || "unknown-client");
}

/**
 * Timing-safe string equality check.
 * Pre-hashes both inputs with SHA-256 so buffers are guaranteed equal length (32 bytes),
 * preventing timing side-channel attacks on key length.
 */
export function timingSafeCompare(a: string | undefined | null, b: string | undefined | null): boolean {
  if (!a || !b) return false;
  try {
    const hashA = crypto.createHash("sha256").update(String(a)).digest();
    const hashB = crypto.createHash("sha256").update(String(b)).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

/**
 * Validates a candidate passkey against ADMIN_SECRET_KEY.
 * Fails CLOSED if ADMIN_SECRET_KEY is missing or empty.
 */
export function verifyAdminPasskey(candidate: string | undefined | null): boolean {
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (!adminSecret || adminSecret.trim().length === 0) {
    return false;
  }
  if (!candidate || typeof candidate !== "string") {
    return false;
  }
  return timingSafeCompare(candidate.trim(), adminSecret.trim());
}

/**
 * Generates an HMAC-SHA256 signed session token for the admin cookie.
 * Token structure: Base64Url(issuedAt:expiresAt).HMACSignature
 * Max session duration: 2 hours (7200 seconds).
 */
export function createAdminSessionToken(maxAgeSeconds = 7200): string {
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (!adminSecret) {
    throw new Error("Cannot create admin session token: ADMIN_SECRET_KEY is not set.");
  }

  const now = Date.now();
  const expiresAt = now + maxAgeSeconds * 1000;
  const payload = `${now}:${expiresAt}`;
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", adminSecret)
    .update(payloadB64)
    .digest("hex");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies an HMAC-signed admin session token.
 * Validates signature, expiry, and structure.
 */
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;

  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (!adminSecret || adminSecret.trim().length === 0) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, providedSig] = parts;

  // Validate signature using timing-safe comparison
  const expectedSig = crypto
    .createHmac("sha256", adminSecret)
    .update(payloadB64)
    .digest("hex");

  if (!timingSafeCompare(providedSig, expectedSig)) {
    return false;
  }

  // Parse and validate expiration
  try {
    const rawPayload = Buffer.from(payloadB64, "base64url").toString("utf8");
    const [issuedAtStr, expiresAtStr] = rawPayload.split(":");
    const expiresAt = Number(expiresAtStr);
    if (!expiresAt || isNaN(expiresAt)) return false;

    if (Date.now() > expiresAt) {
      return false; // Token expired
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validates whether an incoming HTTP request is authorized for administrative endpoints.
 * Checks (in order):
 * 1. `x-admin-key` header (timing-safe check against ADMIN_SECRET_KEY)
 * 2. `qelem_admin_token` cookie (verified HMAC token)
 */
export function verifyAdminApiRequest(request: Request | NextRequest): {
  authorized: boolean;
  error?: string;
  authMethod?: "header" | "cookie";
} {
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (!adminSecret || adminSecret.trim().length === 0) {
    return {
      authorized: false,
      error: "ADMIN_SECRET_KEY is not configured on the server. Access denied (fail closed).",
    };
  }

  // 1. Check x-admin-key header
  const headerKey = request.headers.get("x-admin-key");
  if (headerKey && verifyAdminPasskey(headerKey)) {
    return { authorized: true, authMethod: "header" };
  }

  // 2. Check qelem_admin_token cookie
  let tokenCookie: string | undefined;
  if ("cookies" in request && typeof request.cookies?.get === "function") {
    tokenCookie = request.cookies.get("qelem_admin_token")?.value;
  } else {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/qelem_admin_token=([^;]+)/);
    if (match) {
      tokenCookie = decodeURIComponent(match[1]);
    }
  }

  if (tokenCookie && verifyAdminSessionToken(tokenCookie)) {
    return { authorized: true, authMethod: "cookie" };
  }

  return {
    authorized: false,
    error: "Unauthorized: Valid administrator passkey or session token required.",
  };
}
