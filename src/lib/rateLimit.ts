import type { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

/**
 * In-memory sliding window store.
 * 
 * MULTI-INSTANCE LIMITATION:
 * This in-memory store tracks rate limits in process memory. In serverless or multi-instance
 * deployments without persistent process affinity, counters apply per container instance.
 * For production-wide distributed multi-instance rate limiting across all edge workers,
 * configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables.
 */
const inMemoryStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of inMemoryStore.entries()) {
      if (now > record.resetAt) {
        inMemoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Checks rate limit for a specific identifier (IP address, user ID, or token).
 * Supports Upstash Redis REST API when configured, else falls back to in-memory sliding window.
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Upstash Redis REST API (Distributed)
  if (redisUrl && redisToken) {
    try {
      const key = `ratelimit:${identifier}`;
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["TTL", key],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        // data: [{ result: count }, { result: ttl }]
        const count = Number(data[0]?.result || 1);
        let ttl = Number(data[1]?.result || -1);

        if (ttl === -1 || count === 1) {
          // Set expiry if first increment or unexpired
          await fetch(`${redisUrl}/expire/${key}/${windowSeconds}`, {
            headers: { Authorization: `Bearer ${redisToken}` },
          });
          ttl = windowSeconds;
        }

        const resetAt = Date.now() + Math.max(1, ttl) * 1000;
        const remaining = Math.max(0, limit - count);

        return {
          success: count <= limit,
          limit,
          remaining,
          resetAt,
        };
      }
    } catch (err) {
      console.warn("[RateLimit] Upstash Redis request failed, falling back to in-memory:", err);
    }
  }

  // 2. In-Memory Token Bucket / Sliding Window (Single Instance / Fallback)
  const now = Date.now();
  const cleanId = identifier || "unknown-client";
  const existing = inMemoryStore.get(cleanId);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    inMemoryStore.set(cleanId, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt,
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);

  return {
    success: existing.count <= limit,
    limit,
    remaining,
    resetAt: existing.resetAt,
  };
}

/**
 * Extracts client IP from incoming NextRequest or Request headers.
 */
export function getClientIp(request: Request | NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Convenience helper to enforce rate limiting on incoming Next.js API requests.
 */
export async function enforceRateLimit(
  request: Request | NextRequest,
  limit: number,
  windowSeconds: number,
  prefix: string = "api"
): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  const identifier = `${prefix}:${ip}`;
  return checkRateLimit(identifier, limit, windowSeconds);
}
