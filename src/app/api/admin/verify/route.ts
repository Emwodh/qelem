import { NextRequest, NextResponse } from "next/server";
import {
  checkVerifyRateLimit,
  resetVerifyRateLimit,
  verifyAdminPasskey,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * POST /api/admin/verify
 * Validates the administrative passkey and issues an HMAC-signed session cookie.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Rate limiting check (5 attempts per 15 minutes per IP)
  const rateLimit = checkVerifyRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        valid: false,
        error: `Too many failed attempts. Rate limited. Try again in ${rateLimit.retryAfterSec} seconds.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSec || 900),
        },
      }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const key = body?.key || body?.passkey;

    // Fail closed if ADMIN_SECRET_KEY is not configured
    if (!process.env.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY.trim().length === 0) {
      return NextResponse.json(
        { valid: false, error: "ADMIN_SECRET_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { valid: false, error: "Missing admin passkey parameter." },
        { status: 400 }
      );
    }

    // 2. Timing-safe comparison against ADMIN_SECRET_KEY
    const isValid = verifyAdminPasskey(key);
    if (!isValid) {
      return NextResponse.json(
        { valid: false, error: "Invalid admin passkey" },
        { status: 401 }
      );
    }

    // 3. Reset rate limit on success
    resetVerifyRateLimit(ip);

    // 4. Generate cryptographically signed HMAC session token (2 hour validity)
    const sessionToken = createAdminSessionToken(7200);

    const response = NextResponse.json(
      { valid: true, message: "Administrative access granted." },
      { status: 200 }
    );

    // 5. Set secure httpOnly cookie (does NOT contain the raw passkey)
    response.cookies.set("qelem_admin_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7200, // 2 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: "Internal error processing verification request." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/verify
 * Validates whether the current caller holds an active, unexpired HMAC session token.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("qelem_admin_token")?.value;
  const isSessionValid = verifyAdminSessionToken(token);

  if (isSessionValid) {
    return NextResponse.json({ valid: true, authenticated: true });
  }

  return NextResponse.json(
    { valid: false, authenticated: false, error: "No active admin session." },
    { status: 401 }
  );
}

/**
 * DELETE /api/admin/verify
 * Logs out the administrator and clears the session cookie.
 */
export async function DELETE() {
  const response = NextResponse.json(
    { valid: false, message: "Admin session cleared." },
    { status: 200 }
  );

  response.cookies.set("qelem_admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
